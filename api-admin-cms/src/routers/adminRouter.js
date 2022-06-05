import express from "express";
import { encryptPassword } from "../../helper/bcryptHelper.js";
import {
  emailVerificationValidation,
  newAdminValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import { updateAdmin } from "../models/admin/Admin.model.js";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../helper/emailHelper.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: " GET got hiT to admin router",
  });
});

router.post("/", newAdminValidation, async (req, res, next) => {
  try {
    const hashPassword = encryptPassword(req.body.password);
    req.body.password = hashPassword;

    // create unique id
    req.body.emailValidationCode = uuidv4();
    const result = await insertAdmin(req.body);
    console.log(result);

    if (result?._id) {
      // create unique url and send it to user email

      const url = `${process.env.ROOT_URL}/admin/verify-email/c=${result.emailValidationCode}&e=${result.email}`;

      // send email to the user
      sendMail({ fname: result.fname, url: url });
      res.json({
        status: "success",
        message: "Admin created successfully",
      });
    } else {
      res.json({
        status: "error",
        message:
          "unab le to create new admin, Please try again later or contact the admin",
        hashPassword,
      });
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message = "Email already exists";
      error.status = 200;
    }

    next(error);
  }
});

// email verification rouyter
router.post(
  "/email-verification",
  emailVerificationValidation,
  async (req, res) => {
    console.log(req.body);
    const filter = req.body;
    const update = { status: "active" };
    const result = await updateAdmin(filter, update);
    console.log(result);

    result?._id
      ? res.json({
          status: "success",
          message: "Email verified successfully, You may login know",
        })
      : res.json({
          status: "error",
          message: "Unable to verify your email",
        });
  }
);

router.patch("/", (req, res) => {
  res.json({
    status: "success",
    message: " PATCH got hiT to admin router",
  });
});

export default router;
