import connection from '../db.js';
import rentalSchema from '../schemas/rentalSchema.js';

export function verifySchemaRental(req, res, next) {
  const rental = req.body;

  const validation = rentalSchema.validate(rental, { abortEarly: true });
  if (validation.error) {
    res.status(400).send(validation.error.details);
  }

  next();
}

export async function verifyRental(req, res, next) {
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

    res.locals.rental = rental;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}
