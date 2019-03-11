import { Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import moment from 'moment';

import {
  getCustomersCollection,
  transformDataToRender,
  getSequenceCollection,
  getNextSeq
} from './utils';
import { IExtendedRequest } from './../types/interfaces/request.interface';

export async function getAllCustomersData(
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) {
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

export async function getTotalBalance(req: IExtendedRequest, res: Response, next: NextFunction) {
  try {
    const customersCollection = await getCustomersCollection(req);
    const getTotalBalance = await customersCollection
      .aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: '$balance'
            }
          }
        }
      ])
      .toArray();

    if (_.isEmpty(getTotalBalance)) {
      throw new Error('Not found customers balance');
    }

    const totalBalance = getTotalBalance[0].total;

    res.status(200).send({ totalBalance });
  } catch (err) {
    next(err);
  }
}

export async function getInactiveCustomers(
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const customersCollection = await getCustomersCollection(req);
    const inactiveCustomers: Customer[] = await customersCollection
      .find({ isActive: false })
      .toArray();

    if (_.isEmpty(inactiveCustomers)) {
      throw new Error('Not found inactive customers');
    }

    const transformData = transformDataToRender(inactiveCustomers);

    res.status(200).send(transformData);
  } catch (err) {
    next(err);
  }
}

export async function getCustomerByID(req: IExtendedRequest, res: Response, next: NextFunction) {
  const _id = new ObjectID(req.params._id);

  try {
    const customersCollection = await getCustomersCollection(req);
    const customer: Customer = await customersCollection.findOne({ _id });

    if (_.isEmpty(customer)) {
      throw new Error('Not found customer by _id');
    }

    res.status(200).send(customer);
  } catch (err) {
    next(err);
  }
}

export async function createCustomer(req: IExtendedRequest, res: Response, next: NextFunction) {
  const customer: Customer = req.body as Customer;

  try {
    const sequence = await getSequenceCollection(req);
    const customersCollection = await getCustomersCollection(req);

    const newCustomerData = {
      index: await getNextSeq(sequence),
      guid: uuidv4(),
      isActive: false,
      ...customer,
      registered: moment.utc(new Date()).format('YYYY-MM-DD')
    };

    const response = await customersCollection.insertOne(newCustomerData);

    if (!response.insertedId) {
      throw new Error('Not found new generated customer _id');
    }

    res.status(201).send({ customerId: response.insertedId });
  } catch (err) {
    return next(err);
  }
}
