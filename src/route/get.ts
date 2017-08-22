'use strict';

import * as AWS from 'aws-sdk';

import { Route } from './Route';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const get = (event: LambdaEvent<{ id: string }>, context: Context, callback: LambdaCallback) => {
  console.log(event, context);
  const route = new Route(dynamoDb, event.requestContext.authorizer.email);

  route.get(event.pathParameters.id, (error, route) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the route item.'));
      return;
    }

    const response: HttpResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(route)
    };
    callback(null, response);
  });
}
