import { App, Environment } from "aws-cdk-lib";
import WebsiteAPIStack from "./apiStack";

export type ApplicationEnvironment = {
    readonly NODE_ENV: string;
};

const app = new App();
const env: Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
};

new WebsiteAPIStack(app, "WebsiteLobbyStack", { env });
