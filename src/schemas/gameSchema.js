import Joi from 'joi';

const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
  stockTotal: Joi.number().min(1).integer(),
  categoryId: Joi.number(),
  pricePerDay: Joi.number().min(1).integer(),
});

export default gameSchema;
