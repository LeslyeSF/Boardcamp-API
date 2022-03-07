import express from 'express';
import {
  calcRentals,
  createReantal,
  deleteRental,
  finishRental,
  getRental,
} from '../controllers/rentalsControllers.js';
import {
  verifyRental,
  verifySchemaRental,
} from '../middlewares/rentalsMiddlewares.js';

const rentalsRouters = express.Router();

rentalsRouters.get('/rentals', getRental);

rentalsRouters.post('/rentals', verifySchemaRental, createReantal);

rentalsRouters.post('/rentals/:id/return', verifyRental, finishRental);

rentalsRouters.delete('/rentals/:id', verifyRental, deleteRental);

rentalsRouters.get('/rentals/metrics', calcRentals);

export default rentalsRouters;
