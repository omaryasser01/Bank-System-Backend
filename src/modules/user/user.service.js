import { SECRET_KEY } from "../../../config/config.service.js";
import bankAccModel from "../../DB/models/BankAccount.model.js";
import transModel from "../../DB/models/Transaction.model.js";
import * as db_service from "../../DB/models/db.service.js";
import userModel from "../../DB/models/user.model.js";
import {
  statusEnum,
  transEnum,
  transStatusEnum,
} from "../../common/enum/user.enum.js";
import { compare, hash } from "../../common/security/hash.sec.js";
import { successResp } from "../../common/utils/resp.succ.js";
import { generateToken } from "../../common/utils/token.service.js";
import { randomUUID } from "crypto";

//==================================Create user===============================
export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password, cPassword, role } = req.body;

  if (await db_service.findOne({ model: userModel, filter: { email } })) {
    throw new Error("email already exists");
    return;
  }

  if (password !== cPassword) {
    throw new Error("password and confirm password not match");
  }

  const user = await db_service.create({
    model: userModel,
    data: {
      firstName,
      lastName,
      email,
      password: await hash({ plainText: password }),
      role,
    },
  });

  const userBancAcc = await db_service.create({
    model: bankAccModel,
    data: {
      userID: user._id,
      accountNumber: Math.floor(Math.random() * 1000000000),
      balance: 0,
      currency: "USD",
      status: statusEnum.active,
    },
  });
  const trxSample = await db_service.create({
    model: transModel,
    data: {
      userID: user._id,
      accID: userBancAcc._id,
      amount: Math.floor(Math.random() * 1000000000),
      balanceBefore: 0,
      balanceAfter: 0,
      type: transEnum.deposit,
      status: transStatusEnum.completed,
    },
  });

  successResp({
    res,
    status: 201,
    message: "user created successfully",
    data: { user, userBancAcc },
  });
};

//==================================log in===============================
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db_service.findOne({
    model: userModel,
    filter: { email },
  });

  if (!user) {
    throw new Error("user not found");
  }

  const match = await compare({ plainText: password, hashText: user.password });

  if (!match) {
    throw new Error("Incorrect password");
  }

  const jwtid = randomUUID();

  const access_token = generateToken({
    payload: { userId: user._id, email: user.email },
    secret: SECRET_KEY,
    options: { expiresIn: "5m", jwtid },
  });

  const refresh_token = generateToken({
    payload: { userId: user._id, email: user.email },
    secret: SECRET_KEY,
    options: { expiresIn: "7d", jwtid },
  });

  successResp({
    res,
    status: 200,
    message: "user logged in successfully",
    data: { access_token, refresh_token },
  });
};
