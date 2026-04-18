import express from "express";
import { PORT } from "../config/config.service.js";
import checkDBconnection from "./DB/connectionDB.js";
import UserRouter from "./modules/user/user.controller.js";
import accRouter from "./modules/accounts/accounts.controller.js";
import trxRouter from "./modules/transactions/transactions.controller.js";
import helmet from "helmet";
import cors from "cors";
import expressRateLimiter from "express-rate-limiter";

const app = express();

export const boostrap = async () => {
  // const limiter = expressRateLimiter(
  //   {
  //     windowMs: 60 * 3 * 1000,
  //     limit: 5,
  //   },
  //   { legacyHeaders: false },
  // );

  const corsOptions = {
    origin: (origin, callback) => {
      if ([...white_list, undefined].includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  app.use(express.json(), cors(corsOptions), helmet());

  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "welcome to bank system APP" });
  });

  checkDBconnection();

  app.use("/auth", UserRouter);
  app.use("/accounts", accRouter);
  app.use("/transactions", trxRouter);

  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });

  app.get("{/*demo}", (req, res, next) => {
    throw new Error(`connection to ${req.originalUrl} faild, not found `, {
      cause: 404,
    });
  });

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

export default boostrap;
