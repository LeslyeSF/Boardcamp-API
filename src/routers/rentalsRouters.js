import dayjs from 'dayjs';
import express from 'express';
import connection from '../db.js';
import rentalSchema from '../schemas/rentalSchema.js';

const rentalsRouters = express.Router();

rentalsRouters.get('/rentals', async (req, res) => {
  try {
    const listRentals = await connection.query(
      `SELECT rentals.*, 
      jsonb_build_object('name', customers.name, 'id', customers.id) AS customer,
      jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS games
      FROM rentals 
      JOIN customers ON rentals."customerId"=customers.id
      JOIN games ON rentals."gameId"=games.id
      JOIN categories ON categories.id = games."categoryId"`
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

rentalsRouters.post('/rentals/:id/return', async (req, res) => {
  try {
    const rental = await connection.query('SELECT * FROM rentals WHERE id=$1', [
      req.params.id,
    ]);

    if (rental.rowCount === 0) {
      res.sendStatus(404);
      return;
    }
    if (rental.rows[0].returnDate) {
      res.sendStatus(400);
      return;
    }
    const game = await connection.query('SELECT * FROM games WHERE id=$1', [
      rental.rows[0].gameId,
    ]);
    const { rentDate } = rental.rows[0];
    const returnDate = dayjs().format('YYYY-MM-DD');
    const delayFee =
      // eslint-disable-next-line radix
      (parseInt(dayjs().format('D')) -
        (rentDate.getDate() + rental.rows[0].daysRented)) *
      game.rows[0].pricePerDay;
    await connection.query(
      'UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3',
      [returnDate, delayFee, req.params.id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

rentalsRouters.delete('/rentals/:id', async (req, res) => {
  try {
    const rental = await connection.query('SELECT * FROM rentals WHERE id=$1', [
      req.params.id,
    ]);

    if (rental.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    if (rental.rows[0].returnDate) {
      res.sendStatus(400);
      return;
    }

    await connection.query('DELETE FROM rentals WHERE id=$1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default rentalsRouters;
