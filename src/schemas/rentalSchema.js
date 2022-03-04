import Joi from 'joi';

const rentalSchema = Joi.object({
  customerId: Joi.number().required().integer(),
  gameId: Joi.number().required().integer(),
  daysRented: Joi.number().required().integer().greater(0),
});

export default rentalSchema;
