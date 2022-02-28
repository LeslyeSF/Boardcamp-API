import express from 'express';

const gamesRouters = express.Router();

gamesRouters.get('/games', (req, res) => {
  res.send('get/games');
});
gamesRouters.post('/games', (req, res) => {
  res.send('post/games');
});

export default gamesRouters;
