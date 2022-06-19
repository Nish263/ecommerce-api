import express from "express";
import { encryptPassword, verifyPassword } from "../../helper/bcryptHelper.js";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import {
  updateAdmin,
  insertAdmin,
  getAdmin,
} from "../models/admin/Admin.model.js";
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

      const url = `${process.env.ROOT_URL}/admin/verify-email/?c=${result.emailValidationCode}&e=${result.email}`;

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
          "unable to create new admin, Please try again later or contact the admin",
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
router.post("/verify-email", emailVerificationValidation, async (req, res) => {
  console.log(req.body);
  const filter = req.body;

  const update = { status: "active" };
  const result = await updateAdmin(filter, update);

  if (result?._id) {
    res.json({
      status: "success",
      message: "Email verified successfully, You may login know",
    });
    await updateAdmin(filter, { emailValidationCode: "" });
    //  send email to the user
    return;
  }
  res.json({
    status: "error",
    message: "Invalid or expired link",
  });
});

// login user with email and password
// this feature is not yet implemented

router.post("/login", loginValidation, async (req, res, next) => {
  // query get user by email

  try {
    const { email, password } = req.body;
    // query get user by email
    const user = await getAdmin({ email });

    if (user?._id) {
      if (user.status === "inactive")
        return res.json({
          status: "error",
          message:
            "Your account is not active yet, Please check your email and follow the instruction to activate your account.",
        });
      // if user exist compare password,
      const isMatched = verifyPassword(password, user.password);
      console.log(isMatched);
      if (isMatched) {
        user.password = undefined;
        // for now
        res.json({
          status: "success",
          message: "User Logged in Successfully",
          user,
        });
        return;
      }

      // if match,process for creating jwt and etc.. for future
      // for now send login success message with user
    }
    res.status(401).json({
      status: "error",
      message: "Invalid login credential",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// check for the authentication

export default router;
