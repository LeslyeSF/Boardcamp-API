/* eslint-disable radix */
import connection from '../db.js';

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    let listGames;
    if (name) {
      listGames = await connection.query(
        'SELECT * FROM games WHERE LOWER(name) LIKE $1',
        [`${name.toLowerCase()}%`]
      );
    } else {
      listGames = await connection.query(
        'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;'
      );
    }
    res.status(200).send(listGames.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function insertGame(req, res) {
  const { body } = req;

  try {
    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
      [
        body.name,
        body.image ? body.image : 'https://',
        parseInt(body.stockTotal),
        body.categoryId,
        parseInt(body.pricePerDay),
      ]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}
