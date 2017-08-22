'use strict';

import * as AWS from 'aws-sdk';

import { Route } from './Route';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const list = (event: LambdaEvent<{}>, context: Context, callback: LambdaCallback) => {
  console.log(event, context);
  const route = new Route(dynamoDb, event.requestContext.authorizer.email);
  route.list((error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the routes.'));
      return;
    }

    const response: HttpResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result)
    }
    callback(null, response);
  });
}
