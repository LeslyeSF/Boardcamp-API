import express from 'express';
import { getGames, insertGame } from '../controllers/gamesControllers.js';
import verifyGameInput from '../middlewares/gamesMiddlewares.js';

const gamesRouters = express.Router();

gamesRouters.get('/games', getGames);
gamesRouters.post('/games', verifyGameInput, insertGame);

export default gamesRouters;
