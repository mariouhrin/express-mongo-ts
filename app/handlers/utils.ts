import { Collection } from 'mongodb';

import { IExtendedRequest } from './../types/interfaces/request.interface';

export async function getCustomersCollection(req: IExtendedRequest): Promise<Collection<any>> {
  const db = req.app.locals.db;
  const customersCollection: Collection<any> = await db.collection('customers');
  return customersCollection;
}

export function transformDataToRender(customersData: Customer[]) {
  const transformedData = customersData.map((record: Customer) => ({
    update: 'update',
    delete: 'delete',
    ...record,
    discount: Math.round(record.balance / 10)
  }));

  return transformedData;
}
