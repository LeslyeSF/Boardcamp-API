import connection from '../db.js';

export async function getCustomers(req, res) {
  const { cpf, order, desc, offset, limit } = req.query;
  const orderList = {
    id: 1,
    name: 2,
    phone: 3,
    cpf: 4,
    birthday: 5,
  };
  try {
    let listCustomers;
    if (cpf) {
      listCustomers = await connection.query(
        `SELECT * FROM customers WHERE cpf LIKE $1
        ${order ? `ORDER BY ${orderList[order]} ` : ''}
        ${desc ? 'DESC ' : ''}
        ${limit ? `LIMIT ${limit} ` : ''}
        ${offset ? `OFFSET ${offset} ` : ''}`,
        [`${cpf}%`]
      );
    } else {
      listCustomers = await connection.query(
        `SELECT * FROM customers
        ${order ? `ORDER BY ${order} ` : ''}
        ${desc ? 'DESC ' : ''}
        ${limit ? `LIMIT ${limit} ` : ''}
        ${offset ? `OFFSET ${offset} ` : ''}`
      );
    }

    res.status(200).send(listCustomers.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await connection.query(
      'SELECT * FROM customers WHERE id=$1',
      [id]
    );
    if (customer.rows.length === 0) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(customer.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function insertCustomer(req, res) {
  const customer = req.body;

  try {
    await connection.query(
      'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)',
      [customer.name, customer.phone, customer.cpf, customer.birthday]
    );
    res.send(201);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const customerUpdate = req.body;

  try {
    await connection.query(
      'UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5',
      [
        customerUpdate.name,
        customerUpdate.phone,
        customerUpdate.cpf,
        customerUpdate.birthday,
        id,
      ]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}
