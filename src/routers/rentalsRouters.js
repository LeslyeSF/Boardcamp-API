import dayjs from 'dayjs';
import express from 'express';
import connection from '../db.js';
import rentalSchema from '../schemas/rentalSchema.js';

const rentalsRouters = express.Router();

rentalsRouters.get('/rentals', async (req, res) => {
  try {
    const listRentals = await connection.query(
      'SELECT * FROM rentals JOIN games ON "gameId"=games.id'
    );
    res.status(200).send(listRentals.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

rentalsRouters.post('/rentals', async (req, res) => {
  const rental = req.body;

  const validation = rentalSchema.validate(rental, { abortEarly: true });
  if (validation.error) {
    res.status(400).send(validation.error.details);
  }

  try {
    const userVerify = await connection.query(
      'SELECT * FROM customers WHERE id=$1',
      [rental.customerId]
    );
    const game = await connection.query('SELECT * FROM games WHERE id=$1', [
      rental.gameId,
    ]);
    const rentals = await connection.query(
      'SELECT * FROM rentals WHERE "gameId"=$1',
      [rental.gameId]
    );
    const rentedGames = rentals.rows.filter((data) => data.returnDate === null);

    if (
      userVerify.rowCount === 0 ||
      game.rowCount === 0 ||
      !(rentedGames.length < game.rows[0].stockTotal)
    ) {
      res.sendStatus(400);
      return;
    }

    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        rental.customerId,
        rental.gameId,
        dayjs().format('YYYY-MM-DD'),
        rental.daysRented,
        null,
        game.rows[0].pricePerDay * rental.daysRented,
        null,
      ]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
});

rentalsRouters.post('/rentals/:id/return', (req, res) => {
  res.send('post/rentals/:id/return');
});
rentalsRouters.delete('/rentals/:id', (req, res) => {
  res.send('delete/rentals/:id');
});

export default rentalsRouters;
