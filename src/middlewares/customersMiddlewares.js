import connection from '../db.js';
import customerSchema from '../schemas/customerSchemas.js';

export default async function validateCustomer(req, res, next) {
  const customer = req.body;

  const validation = customerSchema.validate(customer, { abortEarly: true });
  if (validation.error) {
    res.status(400).send(validation.error.details);
    console.log(validation.error.details);
    return;
  }

  const findCpf = await connection.query(
    'SELECT * FROM customers WHERE cpf=$1',
    [customer.cpf]
  );
  if (findCpf.rowCount !== 0) {
    res.sendStatus(409);
    return;
  }

  next();
}
