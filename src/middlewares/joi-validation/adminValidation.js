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
  validator,
  SHORTSTR,
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

  validator(schema, req, res, next);
};
export const updateAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTSTR,
    fname: FNAME,
    lname: LNAME,
    dob: DOB,
    phone: PHONE,
    address: ADDRESS,
    email: EMAIL,
    password: PASSWORD,
  });

  validator(schema, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    emailValidationCode: REQUIREDSTR,
  });

  validator(schema, req, res, next);
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    password: PASSWORD,
  });

  validator(schema, req, res, next);
};
export const updatePasswordalidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    password: PASSWORD,
    currentPassword: PASSWORD,
  });

  validator(schema, req, res, next);
};
