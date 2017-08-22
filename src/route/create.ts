'use strict';

import * as AWS from 'aws-sdk';

import { Route } from './Route';
import { isAuthorized } from './authorizer'

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const create = (event: LambdaEvent<{}>, context: Context, callback: LambdaCallback) => {
  if (!isAuthorized(event.requestContext.authorizer.roles, 'tester')) {
    const response: HttpResponse = {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify('Not authorized')
    }
    callback(null, response);
    return;
  }

  const route = new Route(dynamoDb, event.requestContext.authorizer.email);
  route.create(JSON.parse(event.body), (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the route item.'));
      return;
    }

    console.log('Create Result', result)

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