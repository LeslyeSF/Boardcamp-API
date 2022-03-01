import connection from '../db.js';

export async function getCategories(req, res) {
  try {
    const listCategories = await connection.query('SELECT * FROM categories');
    res.status(200).send(listCategories.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function insertCategory(req, res) {
  let { name } = req.body;
  name = name.charAt(0).toUpperCase() + name.slice(1);

  try {
    await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}
