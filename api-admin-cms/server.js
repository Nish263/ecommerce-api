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
