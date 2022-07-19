import express from "express";
import { newPaymentMethodValidation } from "../middlewares/joi-validation/PaymentValidation.js";
import {
  deletePaymentById,
  getAllPayments,
  insertPaymentMethod,
  updatePaymentById,
} from "../models/paymentMethod/PaymentMethod.model.js";
const router = express.Router();

// return all active categories
router.get("/", async (req, res, next) => {
  try {
    const result = await getAllPayments();
    res.json({
      status: "success",
      message: "payment methods result",
      result,
    });
  } catch (error) {
    next(error);
  }
});

//add new category
router.post("/", newPaymentMethodValidation, async (req, res, next) => {
  try {
    const result = await insertPaymentMethod(req.body);
    console.log(result);
    result?._id
      ? res.json({
          status: "success",
          message: "Payment method has been added",
        })
      : res.json({
          status: "error",
          message: "unable to add payment please try again later",
        });
  } catch (error) {
    error.status = 500;
    if (error.message.includes("E11000 duplicate key")) {
      error.status = 200;
      error.message = "This payment details already exist, please change ";
    }
    next(error);
  }
});

// update status of a categories

router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    if (_id) {
      const result = await deletePaymentById(_id);
      if (result?._id) {
        return res.json({
          status: "success",
          message: "the selected payment method has been deleted",
        });
      }
    }
    res.json({
      status: "error",
      message: "Unable to delete the selected payment method ",
    });
  } catch (error) {
    next(error);
  }
});

// update payment

router.put("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const { _id, ...rest } = req.body;
    if (typeof _id === "string") {
      //call the query
      const result = await updatePaymentById(_id, rest);
      if (result?._id) {
        return res.json({
          status: "success",
          message: "The payment method has been updated",
        });
      }
    }
    res.json({
      status: "error",
      message: "Unable to update the payment method, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
