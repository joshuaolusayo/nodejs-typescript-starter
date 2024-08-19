/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import Joi from "joi";

export const IdSchema = Joi.object({
  id: Joi.string().hex().length(24),
});

export const LanguageSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string().max(3),
});

export const FilenameSchema = Joi.object({
  filename: Joi.string().required(),
});
