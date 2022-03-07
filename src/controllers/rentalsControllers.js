/* eslint-disable radix */
import dayjs from 'dayjs';
import connection from '../db.js';

export async function getRental(req, res) {
  const { customerId, gameId, order, desc, limit, offset, status } = req.query;
  const orderList = {
    id: 1,
    customerId: 2,
    gameId: 3,
    rentDate: 4,
    daysRented: 5,
    returnDate: 6,
    originalPrice: 7,
    delayFee: 8,
  };

  try {
    const listRentals = await connection.query(
      `SELECT rentals.*, jsonb_build_object('name', customers.name, 'id', customers.id) AS customer,
      jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS games
      FROM rentals 
      JOIN customers ON rentals."customerId"=customers.id
      JOIN games ON rentals."gameId"=games.id
      JOIN categories ON categories.id = games."categoryId"
      ${customerId || gameId ? 'WHERE ' : ''}
      ${customerId ? `customers.id=${customerId} ` : ''}
      ${customerId && gameId ? 'AND ' : ''}
      ${gameId ? `games.id=${gameId} ` : ''}
      ${order ? `ORDER BY ${orderList[order]} ` : ''}
      ${desc ? 'DESC ' : ''}
      ${limit ? `LIMIT ${limit} ` : ''}
      ${offset ? `OFFSET ${offset} ` : ''}
      `
    );
    let rentals = listRentals.rows;
    if (status) {
      if (status === 'open') {
        rentals = rentals.filter((data) => !data.returnDate);
      }
      if (status === 'closed') {
        rentals = rentals.filter((data) => !!data.returnDate);
      }
    }
    res.status(200).send(rentals);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function createReantal(req, res) {
  const rental = req.body;

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
}

export async function finishRental(req, res) {
  try {
    const { rental } = res.locals;
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
}

export async function deleteRental(req, res) {
  try {
    await connection.query('DELETE FROM rentals WHERE id=$1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function calcRentals(req, res) {
  try {
    const rentals = await connection.query(
      'SELECT COUNT(id), SUM("delayFee") AS "delaySum", SUM("originalPrice") AS "priceSum" FROM rentals'
    );

    res.send({
      revenue:
        parseInt(rentals.rows[0].delaySum) + parseInt(rentals.rows[0].priceSum),
      rentals: rentals.rows[0].count,
      average:
        parseInt(rentals.rows[0].delaySum) +
        parseInt(rentals.rows[0].priceSum) / parseInt(rentals.rows[0].count),
    });
  } catch (err) {
    res.status(500).send(err);
  }
}
