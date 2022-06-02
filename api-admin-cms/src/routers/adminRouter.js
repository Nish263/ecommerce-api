import express from "express";
import { newAdminValidation } from "../middlewares/joi-validation/adminValidation.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: " GET got hiT to admin router",
  });
});

router.post("/", newAdminValidation, (req, res) => {
  console.log(req.body);
  res.json({
    status: "success",
    message: " POST got hiT to admin router",
  });
});

router.patch("/", (req, res) => {
  res.json({
    status: "success",
    message: " PATCH got hiT to admin router",
  });
});

export default router;
