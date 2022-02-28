import connection from '../db.js';

async function verifyCategorieInput(req, res, next) {
  const { body } = req;
  if (!body.name) {
    res.sendStatus(401);
    return;
  }
  try {
    const categorieVerify = await connection.query(
      'SELECT * FROM categories WHERE name=$1',
      [body.name]
    );

    if (categorieVerify.rows.length !== 0) {
      res.sendStatus(409);
      return;
    }
    next();
  } catch (err) {
    res.status(500).send(err);
  }
}

export default verifyCategorieInput;