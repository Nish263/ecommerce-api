import express from "express";
import { encryptPassword, verifyPassword } from "../helper/bcryptHelper.js";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminValidation,
  updateAdminValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import {
  insertAdmin,
  getAdmin,
  updateAdmin,
} from "../models/admin/Admin.model.js";
import { v4 as uuidv4 } from "uuid";
import {
  OtpNotificationMail,
  profileUpdateNotificationMail,
  sendMail,
} from "../helper/emailHelper.js";
import { createOtp } from "../helper/randomGenerator.js";
import {
  deleteSession,
  getSession,
  insertSession,
} from "../models/session/Session.model.js";
import {
  createJWTs,
  signAccessJwt,
  verifyRefreshJwt,
} from "../helper/jwtHelper.js";
import { adminAuth } from "../middlewares/joi-validation/authMiddleware.js";

const router = express.Router();

router.get("/", adminAuth, (req, res) => {
  try {
    let user = req.adminInfo;
    user.password = undefined;
    user.refreshJWT = undefined;
    res.json({
      status: "success",
      message: " GET got hiT to admin router",
      user,
    });
  } catch (error) {
    next(error);
  }
});
// new admin registration
router.post("/", adminAuth, newAdminValidation, async (req, res, next) => {
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

// update admin profile
router.put("/", adminAuth, updateAdminValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // query get user by email
    const user = await getAdmin({ email });

    if (user?._id) {
      const isMatched = verifyPassword(password, user.password);
      if (isMatched) {
        // update user
        const { _id, password, ...rest } = req.body;
        const updatedAdmin = await updateAdmin({ _id }, rest);

        if (updatedAdmin?._id) {
          // send emasil verification saying profile is update
          profileUpdateNotificationMail({
            fname: updatedAdmin.fname,
            email: updateAdmin.email,
          });
          return res.json({
            status: "success",
            message: "Your profile has been updated successfully",
            user: updatedAdmin,
          });
        }
      }
    }
    res.json({
      status: "error",
      message: "Invalid request, Your profile didn't get updated",
    });
  } catch (error) {
    error.status = 200;
  }
  next(error);
});

// update password by the loggedin admin
router.patch("/update-password", adminAuth, async (req, res, next) => {
  try {
    const { currentPassword, email, newPassword } = req.body;
    console.log(req.body);
    const user = await getAdmin({ email });
    if (user?._id) {
      const isMatched = verifyPassword(currentPassword, user.password);
      if (isMatched) {
        const hashPassword = encryptPassword(newPassword);

        const updatedUser = await updateAdmin(
          { _id: user._id },
          { password: hashPassword }
        );

        if (updatedUser?._id) {
          profileUpdateNotificationMail({
            fname: updatedUser.fname,
            email: updatedUser.email,
          });
          res.json({
            status: "success",
            message: "Your password has been updated successfully",
          });
        }
      }
    }
    res.json({
      status: "error",
      message: "Error! unable to updte password",
    });

    // 1. get session info based on the token, so that we get the use associate

    // }
    // 2. based on the email update pssword in the database after encrypting
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// email verification router
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
        const jwts = await createJWTs({ email: user.email });
        res.json({
          status: "success",
          message: "User Logged in Successfully",
          user,
          ...jwts,
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

// password request OTP request

router.post("/otp-request", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      // if user exist
      const user = await getAdmin({ email });
      if (user?._id) {
        // create OTP and send email
        const otp = createOtp();
        const obj = {
          token: createOtp(),
          associate: email,
          type: "updatePassword",
        };
        const result = await insertSession(obj);
        console.log(result);
        if (result?._id) {
          res.json({
            status: "success",
            message:
              "If your email exist in our system, we will send you an OTP, Plese check you email",
          });

          // send the email
          return OtpNotificationMail({
            token: result.token,
            email: email,
          });
        }
      }
    }
    res.json({
      status: "error",
      message: "Invalid request",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

router.patch("/password", async (req, res, next) => {
  try {
    const { otp, email, password } = req.body;
    console.log(req.body, "111");
    // 1. get session info based on the token, so that we get the use associate
    const session = await deleteSession({ token: otp, associate: email });
    console.log(session, "222");
    if (session?._id) {
      const update = {
        password: encryptPassword(password),
      };
      const updatedUser = await updateAdmin({ email }, update);
      console.log(updatedUser, "333");
      if (updatedUser?._id) {
        // send the email notification
        profileUpdateNotificationMail({
          fname: updatedUser.fname,
          email: updatedUser.email,
        });
        return res.json({
          status: "success",
          message: "Your password has been updated",
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid request, unable to update the password",
    });
    // 2. based on the email update pssword in the database after encrypting
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

//this will return new access JWT
router.get("/accessjwt", async (req, res, next) => {
  try {
    const refreshJWT = req.headers.authorization;
    console.log(refreshJWT);
    const decoded = verifyRefreshJwt(refreshJWT);
    if (decoded?.email) {
      const user = await getAdmin({
        email: decoded.email,
        refreshJWT,
      });

      if (user?._id) {
        const accessJWT = await signAccessJwt({ email: decoded.email });
        res.json({
          status: "success",
          accessJWT,
        });
      }
    }
    res.status(401).json({
      status: "error",
      message: "logout user",
    });
    // check refJWT valid and exist in db
    // create new accessJWT and return it
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
