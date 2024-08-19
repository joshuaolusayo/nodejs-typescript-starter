/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import Joi from "joi";

export const ContactCreationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

export const ContactUpdationSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  message: Joi.string(),
});
