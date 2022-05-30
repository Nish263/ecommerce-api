import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "First Name must be less than 20 characters"],
    },
    lname: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "First Name must be less than 20 characters"],
    },
    dob: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Email must be less than 50 characters"],
      unique: true,
      index: 1,
    },

    phone: {
      type: String,
      required: true,
    },
    pass: {
      type: String,
      default: "n/a",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", AdminSchema);
