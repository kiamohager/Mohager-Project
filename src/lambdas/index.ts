import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    GetCommand,
    PutCommand,
    UpdateCommand,
    DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { USERS_TABLE } from "../../infrastructure/apiStack";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const TTL_IN_SECONDS = 60 * 60 * 24 * 30;

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const id = event.queryStringParameters?.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing id" })
        };
    }

    const user = await ddb.send(
        new GetCommand({
            TableName: USERS_TABLE,
            Key: { id }
        })
    );

    if (!user.Item) {
        await ddb.send(
            new PutCommand({
                TableName: USERS_TABLE,
                Item: {
                    id,
                    times: 1,
                    expiresAt: Math.floor(Date.now() / 1000) + TTL_IN_SECONDS
                }
            })
        );
    } else if (user.Item.times > 10) {
        return {
            statusCode: 429,
            body: JSON.stringify({ error: "You make me sad 😢" })
        };
    } else {
        await ddb.send(
            new UpdateCommand({
                TableName: USERS_TABLE,
                Key: { id },
                UpdateExpression: "SET times = times + :inc",
                ExpressionAttributeValues: {
                    ":inc": 1
                }
            })
        );
    }

    const soundStat = { message: "Sound stat processed!" };

    return {
        statusCode: 200,
        body: JSON.stringify(soundStat)
    };
};
