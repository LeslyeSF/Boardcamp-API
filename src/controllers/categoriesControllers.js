import connection from '../db.js';

export async function getCategories(req, res) {
  try {
    const listCategories = await connection.query('SELECT * FROM categories');
    res.status(200).send(listCategories.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function insertCategorie(req, res) {
  const { body } = req;
  try {
    await connection.query('INSERT INTO categories (name) VALUES ($1)', [
      body.name,
    ]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}
