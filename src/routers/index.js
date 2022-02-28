import express from 'express';
import categoriesRouters from './categoriesRouters.js';
import customersRouters from './customersRouters.js';
import gamesRouters from './gamesRouters.js';
import rentalsRouters from './rentalsRouters.js';

const routers = express.Router();

routers.use(categoriesRouters);
routers.use(gamesRouters);
routers.use(customersRouters);
routers.use(rentalsRouters);

export default routers;
