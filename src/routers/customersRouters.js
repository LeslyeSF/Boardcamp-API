import express from 'express';
import {
  getCustomers,
  getCustomerById,
  insertCustomer,
  updateCustomer,
} from '../controllers/customersControllers.js';
import validateCustomer from '../middlewares/customersMiddlewares.js';

const customersRouters = express.Router();

customersRouters.get('/customers', getCustomers);
customersRouters.get('/customers/:id', getCustomerById);
customersRouters.post('/customers', validateCustomer, insertCustomer);
customersRouters.put('/customers/:id', validateCustomer, updateCustomer);

export default customersRouters;
