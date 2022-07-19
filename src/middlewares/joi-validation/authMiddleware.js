import { verifyAccessJwt } from "../../helper/jwtHelper.js";
import { getAdmin } from "../../models/admin/Admin.model.js";
import { getSession } from "../../models/session/Session.model.js";

export const adminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const decoded = verifyAccessJwt(authorization);
      if (decoded === "jwt expired") {
        res.status(403).json({
          ststus: "error",
          message: "JWT expired",
        });
      }
      if (decoded?.email) {
        const existInDb = await getSession({
          type: "jwt",
          token: authorization,
        });
        // check if exist in database
        if (existInDb?._id) {
          const admin = await getAdmin({ email: decoded.email });
          if (admin?._id) {
            req.adminInfo = admin;
            return next();
          }
        }
      }
    }
    res.json({
      status: "error",
      messge: "Unauthorized",
    });
    //   get the accessJwt from header
    // check if it is valid and not expired

    // get the user info and attach i ourx
  } catch (error) {
    next(error);
  }
};
