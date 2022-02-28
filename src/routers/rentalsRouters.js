import express from 'express';

const rentalsRouters = express.Router();

rentalsRouters.get('/rentals', (req, res) => {
  res.send('get/rentals');
});
rentalsRouters.post('/rentals', (req, res) => {
  res.send('post/rentals');
});
rentalsRouters.post('/rentals/:id/return', (req, res) => {
  res.send('post/rentals/:id/return');
});
rentalsRouters.delete('/rentals/:id', (req, res) => {
  res.send('delete/rentals/:id');
});

export default rentalsRouters;
