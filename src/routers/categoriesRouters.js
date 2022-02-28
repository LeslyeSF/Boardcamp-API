import express from 'express';
import {
  getCategories,
  insertCategorie,
} from '../controllers/categoriesControllers.js';
import verifyCategorieInput from '../middlewares/categoriesMiddlewares.js';

const categoriesRouters = express.Router();

categoriesRouters.get('/categories', getCategories);
categoriesRouters.post('/categories', verifyCategorieInput, insertCategorie);

export default categoriesRouters;
