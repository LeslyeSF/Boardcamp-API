/* eslint-disable radix */
import connection from '../db.js';

export async function getGames(req, res) {
  const { name, order, desc, offset, limit } = req.query;
  const orderList = {
    id: 1,
    name: 2,
    image: 3,
    stockTotal: 4,
    categoryId: 5,
    pricePerDay: 6,
    categoryName: 7,
  };
  try {
    let listGames;
    if (name) {
      listGames = await connection.query(
        `SELECT * FROM games WHERE LOWER(name) LIKE $1
        ${order ? `ORDER BY ${orderList[order]} ` : ''}
        ${desc ? 'DESC ' : ''}
        ${limit ? `LIMIT ${limit} ` : ''}
        ${offset ? `OFFSET ${offset} ` : ''}`,
        [`${name.toLowerCase()}%`]
      );
    } else {
      listGames = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id
        ${order ? `ORDER BY ${order} ` : ''}
        ${desc ? 'DESC ' : ''}
        ${limit ? `LIMIT ${limit} ` : ''}
        ${offset ? `OFFSET ${offset} ` : ''}`
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
