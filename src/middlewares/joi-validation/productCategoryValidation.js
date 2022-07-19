import {
  SHORTSTR,
  LONGSTR,
  validator,
  PRICE,
  DATE,
  QTY,
} from "./constantValidation.js";
import Joi from "joi";

export const newProductValidation = (req, res, next) => {
  try {
    console.log(req.body);
    req.body.salesStartDate =
      req.body.salesStartDate === "null" ? null : req.body.salesStartDate;
    req.body.salesEndDate =
      req.body.salesEndDate === "null" ? null : req.body.salesEndDate;

    const schema = Joi.object({
      _id: SHORTSTR.allow(""),
      status: SHORTSTR,
      name: SHORTSTR.required(),
      sku: SHORTSTR.required(),
      description: LONGSTR.required(),
      qty: QTY.required(),
      price: PRICE.required(),
      salesPrice: PRICE,
      salesStartDate: DATE.allow(null, ""),
      salesEndDate: DATE.allow(null, ""),
      catId: SHORTSTR.required(),
    });

    validator(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};

export const newCategoryValidation = (req, res, next) => {
  try {
    console.log("validation");
    const schema = Joi.object({
      _id: SHORTSTR.allow(""),
      parentCatId: SHORTSTR.allow(null, ""),
      catName: SHORTSTR.required(),
      status: SHORTSTR,
    });

    validator(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};

export const updateProductValidation = (req, res, next) => {
  try {
    req.body.salesStartDate =
      req.body.salesStartDate === "null" ? null : req.body.salesStartDate;
    req.body.salesEndDate =
      req.body.salesEndDate === "null" ? null : req.body.salesEndDate;
    const schema = Joi.object({
      status: SHORTSTR,
      _id: SHORTSTR.required(),
      name: SHORTSTR.required(),
      description: LONGSTR.required(),
      qty: QTY.required(),
      price: PRICE.required(),
      salesPrice: PRICE,
      salesStartDate: DATE.allow(null),
      salesEndDate: DATE.allow(null),
      catId: SHORTSTR.required(),
      images: LONGSTR.allow(null, ""),
      thumbnail: SHORTSTR.allow(null, ""),
      imgToDelete: LONGSTR.allow(null, ""),
    });

    validator(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};
