import mongoose from "mongoose";
export const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_CLIENT);
    conn && console.log("Mongo is connected");
  } catch (error) {
    console.log(error);
  }
};
