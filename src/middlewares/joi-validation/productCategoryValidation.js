import Joi from "joi";
import {
  SHORTSTR,
  LONGSTR,
  validationProcessor,
} from "./constantValidation.js";

export const newCategoryValidation = (req, res, next) => {
  console.log("validation");
  try {
    const schema = Joi.object({
      parentCategory: SHORTSTR.allow(""),
      categoryName: SHORTSTR.required(),
    });

    validationProcessor(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};
