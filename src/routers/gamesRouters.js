/* eslint-disable radix */
import express from 'express';
import Joi from 'joi';
import connection from '../db.js';

const gamesRouters = express.Router();

gamesRouters.get('/games', async (req, res) => {
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
});
const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
  stockTotal: Joi.number().min(1).integer(),
  categoryId: Joi.number(),
  pricePerDay: Joi.number().min(1).integer(),
});
gamesRouters.post('/games', async (req, res) => {
  const { body } = req;
  const validation = gameSchema.validate(body, { abortEarly: true });
  if (validation.error) {
    res.status(400).send(validation.error.details);
    return;
  }
  try {
    if (body.categoryId) {
      const findCategory = await connection.query(
        'SELECT * FROM categories WHERE id=$1',
        [body.categoryId]
      );
      if (findCategory.rows.length === 0) {
        res.sendStatus(400);
        return;
      }
    }
    const nameVerify = await connection.query(
      'SELECT * FROM games WHERE LOWER(name)=$1',
      [body.name.toLowerCase()]
    );
    if (nameVerify.rows.length !== 0) {
      res.sendStatus(409);
      return;
    }
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
});

export default gamesRouters;
