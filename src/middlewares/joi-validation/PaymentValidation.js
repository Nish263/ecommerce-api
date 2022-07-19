import Joi from "joi";
import { LONGSTR, SHORTSTR, validator } from "./constantValidation.js";

export const newPaymentMethodValidation = (req, res, next) => {
  const schema = Joi.object({
    status: SHORTSTR.required(),
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
  });

  validator(schema, req, res, next);
};
export const updatePaymentMethodValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTSTR(null, ""),
    status: SHORTSTR.required(),
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
  });

  validator(schema, req, res, next);
};
