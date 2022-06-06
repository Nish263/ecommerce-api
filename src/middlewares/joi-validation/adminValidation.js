import Joi from "joi";

export const newAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    fname: Joi.string().required().min(3).max(20),
    lname: Joi.string().required().min(3).max(20),
    dob: Joi.date().allow(null),
    phone: Joi.string().required().min(10).max(15),
    address: Joi.string().allow(null),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  });

  const { values, error } = schema.validate(req.body);

  if (error) {
    return res.json({
      status: "error",
      message: error.message,
    });
  }
  next();
};

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    emailValidationCode: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.json({
      status: "error",
      message: error.message,
    });
  }
  next();
};
