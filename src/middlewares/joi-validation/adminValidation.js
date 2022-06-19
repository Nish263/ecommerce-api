import Joi from "joi";
import {
  FNAME,
  LNAME,
  DOB,
  EMAIL,
  PASSWORD,
  PHONE,
  ADDRESS,
  REQUIREDSTR,
  validationProcessor,
} from "./constantValidation.js";

export const newAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    fname: FNAME,
    lname: LNAME,
    dob: DOB,
    phone: PHONE,
    address: ADDRESS,
    email: EMAIL,
    password: PASSWORD,
  });

  validationProcessor(schema, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    emailValidationCode: REQUIREDSTR,
  });

  validationProcessor(schema, req, res, next);
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    password: PASSWORD,
  });

  validationProcessor(schema, req, res, next);
};
