import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive", // either active or inactive
    },
    name: {
      type: String,
      unique: true,
      maxlength: 100,
      required: true,
      index: 1,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment_Method", PaymentMethodSchema);
