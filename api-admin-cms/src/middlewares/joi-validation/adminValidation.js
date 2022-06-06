import Joi from "joi";

const fname = Joi.string().required().min(3).max(20);
const lname = Joi.string().required().min(3).max(20);
const dob = Joi.date().allow(null);
const phone = Joi.string().required().min(10).max(15);
const address = Joi.string().allow(null);
const email = Joi.string().email({ minDomainSegments: 2 }).required();
const password = Joi.string().required();
const requiredStr = Joi.string().required();

const validationProcessor = (schema, req, res, next) => {
  const { value, error } = schema.validate(req.body);

  if (error) {
    return res.json({
      status: "error",
      message: error.message,
    });
  }
  next();
};

export const newAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    fname,
    lname,
    dob,
    phone,
    address,
    email,
    password,
  });

  validationProcessor(schema, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email,
    emailValidationCode: requiredStr,
  });

  validationProcessor(schema, req, res, next);
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email,
    password,
  });

  validationProcessor(schema, req, res, next);
};
