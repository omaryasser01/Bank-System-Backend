import { SECRET_KEY } from "../../../config/config.service.js";
import bankAccModel from "../../DB/models/BankAccount.model.js";
import * as db_service from "../../DB/models/db.service.js";
import userModel from "../../DB/models/user.model.js";
import { successResp } from "../utils/resp.succ.js";
import { verifyToken } from "../utils/token.service.js";

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("token not exist");
  }

  const [prefix, token] = authorization.split(" ");
  if (prefix !== "bearer") {
    throw new Error("invalid prefix");
  }
  const decoded = verifyToken({ token, secret: SECRET_KEY });

  if (!decoded || !decoded?.userId) {
    throw new Error("invalid token");
  }

  const user = await db_service.findOne({
    model: userModel,
    filter: { _id: decoded.userId },
  });

  if (!user) {
    throw new Error("invalid token user not exist");
  }

  const bankAcc = await db_service.findOne({
    model: bankAccModel,
    filter: { userID: decoded.userId },
  });

  req.user = user;
  req.bankAcc = bankAcc;
  next();
};
