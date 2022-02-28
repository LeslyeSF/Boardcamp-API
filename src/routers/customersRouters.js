import express from 'express';

const customersRouters = express.Router();

customersRouters.get('/customers', (req, res) => {
  res.send('get/customers');
});
customersRouters.get('/customers/:id', (req, res) => {
  res.send('get/customers/:id');
});
customersRouters.post('/customers', (req, res) => {
  res.send('post/customers/:id');
});
customersRouters.put('/customers/:id', (req, res) => {
  res.send('put/customers/:id');
});

export default customersRouters;
