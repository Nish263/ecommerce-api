import "dotenv/config";
import express, { application } from "express";

const app = express();

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

const PORT = process.env.PORT || 8000;

// use middlewares
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

// server static content
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "public")));
// mongo db connect
import { dbConnect } from "./src/config/dbConfig.js";
dbConnect();

// routers
import adminRouter from "./src/routers/adminRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";
import productRouter from "./src/routers/productRouter.js";
import customerRouter from "./src/routers/customerRouter.js";
import paymentMethodRouter from "./src/routers/paymentMethodRouter.js";
import { adminAuth } from "./src/middlewares/joi-validation/authMiddleware.js";
import reviewRouter from "./src/routers/reviewRouter.js";
import orderRouter from "./src/routers/orderRouter.js";

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", adminAuth, categoryRouter);
app.use("/api/v1/products", adminAuth, productRouter);
app.use("/api/v1/payment-method", adminAuth, paymentMethodRouter);
app.use("/api/v1/customers", adminAuth, customerRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.get("/", (req, res) => {
  res.json({
    message: "you have reached the admin api",
  });
});

// error handlinhg

app.use((err, req, res, next) => {
  console.log(err);

  res.status(err.status || 400);
  res.json({
    status: "error",
    message: err.message,
  });
});

// bound app with the port to server the internet

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server running on http://localhost:${PORT}`);
});
