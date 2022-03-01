import connection from '../db.js';
import gameSchema from '../schemas/gameSchema.js';

async function verifyGameInput(req, res, next) {
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
  } catch (err) {
    res.status(500).send(err);
  }

  next();
}

export default verifyGameInput;
