import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Cors, EndpointType, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { Alarm, ComparisonOperator, MathExpression } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { AttributeType, BillingMode, ProjectionType, Table } from "aws-cdk-lib/aws-dynamodb";

import {
    ManagedPolicy,
    PolicyDocument,
    PolicyStatement,
    Role,
    ServicePrincipal
} from "aws-cdk-lib/aws-iam";
import {
    ApplicationLogLevel,
    Code,
    FunctionProps,
    Function as LambdaFunction,
    LoggingFormat,
    Runtime,
    SystemLogLevel,
    Tracing
} from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Topic } from "aws-cdk-lib/aws-sns";

import { Construct } from "constructs";
import { config } from "dotenv";

import { ApplicationEnvironment } from "./infra";

export const USERS_TABLE = "website-users";

class WebsiteAPIStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const env = config().parsed as ApplicationEnvironment | undefined;
        if (!env) {
            throw new Error("Environment variables not found");
        }

        const usersTable = this.createUsersTable();

        const lambdaRole = this.createLambdaRole(usersTable);
        const lambda = this.createLambda(env, lambdaRole);

        const certificate = new Certificate(this, "websiteCertificate", {
            domainName: "kiamohager.com",
            subjectAlternativeNames: ["*.kiamohager.com"],
            validation: CertificateValidation.fromDns()
        });
        const restApi = this.createAPI(certificate, lambda);

        const alarmTopic = this.createAlarmActions();
        this.createLambdaErrorRateAlarms(alarmTopic, [lambda]);
        this.createRestAPIErrorRateAlarms(alarmTopic, restApi);
    }

    private createUsersTable(): Table {
        return new Table(this, "websiteUsersTable", {
            tableName: USERS_TABLE,
            partitionKey: { name: "spotifyId", type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
            timeToLiveAttribute: "expirationTime"
        });
    }

    private createAPI(certificate: Certificate, lambda: LambdaFunction): RestApi {
        const api = new RestApi(this, "websiteRestApi", {
            restApiName: "Project Website API",
            description: "The service endpoint for Website's API",
            domainName: {
                domainName: "api.kiamohager.com",
                endpointType: EndpointType.EDGE,
                certificate
            },
            disableExecuteApiEndpoint: true,
            deployOptions: { stageName: "production", tracingEnabled: true },
            defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS },
            endpointExportName: "WebsiteApiEndpoint"
        });
        api.root.addResource("trackStats").addMethod("POST", new LambdaIntegration(lambda));
        return api;
    }

    private createLambda(env: ApplicationEnvironment, role: Role): LambdaFunction {
        return new LambdaFunction(this, "websiteLambda", {
            functionName: "website-trackStats",
            handler: "index.handler",
            code: Code.fromAsset("dist/trackStats"),
            runtime: Runtime.NODEJS_LATEST,
            ...this.createLambdaParams(env, role)
        });
    }

    private createLambdaParams(env: ApplicationEnvironment, role: Role): Partial<FunctionProps> {
        return {
            role,
            memorySize: 2048,
            timeout: Duration.seconds(29),
            tracing: Tracing.ACTIVE,
            logRetention: RetentionDays.ONE_MONTH,
            loggingFormat: LoggingFormat.JSON,
            applicationLogLevelV2: ApplicationLogLevel.WARN,
            systemLogLevelV2: SystemLogLevel.WARN,
            environment: { ...env, NODE_OPTIONS: "--enable-source-maps" }
        };
    }

    private createLambdaRole(...tables: Table[]): Role {
        return new Role(this, "websiteLambdaRole", {
            roleName: "WebsiteLambdaRole",
            assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
                ManagedPolicy.fromAwsManagedPolicyName("AWSXrayWriteOnlyAccess")
            ],
            inlinePolicies: {
                IAMAccessPolicy: new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: ["iam:PassRole"],
                            resources: ["*"]
                        })
                    ]
                }),
                TableAccessPolicy: new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: [
                                "dynamodb:GetItem",
                                "dynamodb:DeleteItem",
                                "dynamodb:PutItem",
                                "dynamodb:Query",
                                "dynamodb:UpdateItem"
                            ],
                            resources: tables.flatMap((table) => [
                                table.tableArn,
                                table.tableArn + "/index/*"
                            ])
                        })
                    ]
                })
            }
        });
    }

    private createLambdaErrorRateAlarms(alarmTopic: Topic, lambdas: LambdaFunction[]): Alarm[] {
        return lambdas.map((lambda) => {
            const alarm = new Alarm(this, `${lambda.node.id}-sucessRate`, {
                alarmName: `${lambda.functionName} Success Rate`,
                metric: new MathExpression({
                    label: "Success Rate",
                    expression: "1 - errors / invocations",
                    usingMetrics: {
                        errors: lambda.metricErrors(),
                        invocations: lambda.metricInvocations()
                    },
                    period: Duration.minutes(1)
                }),
                threshold: 0.99,
                comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
                evaluationPeriods: 5
            });
            alarm.addAlarmAction(new SnsAction(alarmTopic));
            return alarm;
        });
    }

    private createRestAPIErrorRateAlarms(alarmTopic: Topic, api: RestApi): Alarm[] {
        const errorRateMetrics = [api.metricClientError(), api.metricServerError()];
        return errorRateMetrics.map((metric) => {
            const alarm = new Alarm(this, `${api.node.id}-${metric.metricName}`, {
                alarmName: `website-${metric.metricName}`,
                metric: new MathExpression({
                    label: "Success Rate",
                    expression: "1 - errors / invocations",
                    usingMetrics: {
                        errors: metric,
                        invocations: api.metricCount()
                    },
                    period: Duration.minutes(1)
                }),
                threshold: 0.99,
                comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
                evaluationPeriods: 5
            });
            alarm.addAlarmAction(new SnsAction(alarmTopic));
            return alarm;
        });
    }

    private createAlarmActions() {
        return new Topic(this, "websiteAlarmTopic", {
            topicName: "website-alarms"
        });
    }
}

export default WebsiteAPIStack;
