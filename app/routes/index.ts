import { Router } from 'express';
import * as handlers from './../handlers';

const router: Router = Router();

router.get('/customers', handlers.getAllCustomersData);

router.get('/customers/total', handlers.getTotalBalance);

router.get('/customers/inactive', handlers.getInactiveCustomers);

router.get('/customers/:_id', handlers.getCustomerByID);

router.post('/customers', handlers.createCustomer);
// {
// {
//   method: 'POST',
//   path: '/api/customers',
//   options: {
//     validate: {
//       payload: JoiCustomer
//     },
//     description: 'Create new customer'
//   },
//   handler: handler.createCustomer
// },
// {
//   method: 'PUT',
//   path: '/api/customers/{_id}',
//   options: {
//     validate: {
//       params: {
//         _id: Joi.string().required()
//       },
//       payload: JoiCustomer
//     },
//     description: 'Update customer data'
//   },
//   handler: handler.updateCustomer
// },
// {
//   method: 'DELETE',
//   path: '/api/customers/{_id}',
//   options: {
//     validate: {
//       params: {
//         _id: Joi.string().required()
//       }
//     },
//     description: 'Delete customer by _id'
//   },
//   handler: handler.deleterCustomer
// }

export const Routes: Router = router;
