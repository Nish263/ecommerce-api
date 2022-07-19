import express from "express";
import { getCustomers } from "../fake-db/fakeDB.js";

const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { data } = await getCustomers(_id);

    res.json({
      status: "success",
      message: "customer lists",
      customers: data,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
