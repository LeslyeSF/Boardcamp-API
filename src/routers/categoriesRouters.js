import express from 'express';
import {
  getCategories,
  insertCategory,
} from '../controllers/categoriesControllers.js';
import verifyCategoryInput from '../middlewares/categoriesMiddlewares.js';

const categoriesRouters = express.Router();

categoriesRouters.get('/categories', getCategories);
categoriesRouters.post('/categories', verifyCategoryInput, insertCategory);

export default categoriesRouters;
