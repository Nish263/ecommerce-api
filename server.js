import "dotenv/config";
import express from "express";

const app = express();

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const PORT = process.env.PORT || 8000;

// use middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// mongo db connect
import { dbConnect } from "./src/config/dbConfig.js";
dbConnect();

// routers
import adminRouter from "./src/routers/adminRouter.js";

app.use("/api/v1/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({
    message: "you have reached the admin api",
  });
});

// error handlinhg

app.use((err, req, res, next) => {
  console.log(err);
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
