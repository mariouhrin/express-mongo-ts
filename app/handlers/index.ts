import { Response, NextFunction } from 'express';
import _ from 'lodash';

import { getCustomersCollection, transformDataToRender } from './utils';
import { IExtendedRequest } from './../types/interfaces/request.interface';

export async function getAllData(req: IExtendedRequest, res: Response, next: NextFunction) {
  try {
    const customersCollection = await getCustomersCollection(req);
    const allCustomers: Customer[] = await customersCollection.find().toArray();

    if (_.isEmpty(allCustomers)) {
      throw new Error('Not found customers data');
    }

    const transformData = transformDataToRender(allCustomers);

    res.status(200).send(transformData);
  } catch (err) {
    next(err);
  }
}
