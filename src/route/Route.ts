import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

import { routeTable } from './config'
import { validate } from './validator'

export class Route {
  constructor(private db: AWS.DynamoDB.DocumentClient, private userEmail: string) { }

  public get = (id: string, callback: (error: Error, route?: TRoute) => void) => {
    const params = {
      TableName: routeTable,
      Key: {
        id
      }
    };

    this.db.get(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t fetch the route item.'));
        return;
      }

      const route = result.Item as TRoute;

      callback(null, route);
    });
  }

  public list = (callback: (error: Error, route?: TRoute[]) => void) => {
    const params = {
      TableName: routeTable
    };

    this.db.scan(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t fetch the routes.'));
        return;
      }

      callback(null, result.Items as TRoute[]);
    });
  }

  public create = (data: TRoute, callback: (error: Error, route?: TRoute) => void) => {
    if (!validate(data)) {
      console.error('Validation Failed');
      callback(new Error('Couldn\'t create the route item.'));
      return;
    }

    const timestamp = new Date().getTime();
    const params = {
      TableName: routeTable,
      Item: {
        ...data,
        id: uuid.v4(),
        user: this.userEmail,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    this.db.put(params, (error, result) => {
      console.log('Put', error, result)
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t create the route item.'));
        return;
      }

      callback(null, params.Item as any as TRoute);
    });
  }

  public update = (id: string, route: TRoute, callback: (error: Error, route?: TRoute) => void) => {
    const data = {
      ...route,
      id,
    };

    if (!validate(data)) {
      console.error('Validation Failed');
      callback(new Error('Couldn\'t create the route item.'));
      return;
    }

    const timestamp = new Date().getTime();
    const params = {
      TableName: routeTable,
      Item: {
        ...data,
        updateAt: timestamp
      }
    };

    this.db.put(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t create the route item.'));
        return;
      }

      callback(null, params.Item as any as TRoute);
    });
  }
}