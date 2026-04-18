import bankAccModel from "../../DB/models/BankAccount.model.js";
import transModel from "../../DB/models/Transaction.model.js";
import * as db_service from "../../DB/models/db.service.js";
import {
  statusEnum,
  transEnum,
  transStatusEnum,
} from "../../common/enum/user.enum.js";
import { successResp } from "../../common/utils/resp.succ.js";

//==================================all transactions details===============================
export const trxDetails = async (req, res, next) => {
  let { page, limit } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const trx = await db_service.find({
    model: transModel,
    filter: { userID: req.user._id },
    options: {
      skip: (page - 1) * limit,
      limit,
    },
  });

  successResp({
    res,
    status: 200,
    message: "done",
    data: trx,
  });
};

//==================================single transactions details===============================
export const singleTrxDetails = async (req, res, next) => {
  const trx = await db_service.findOne({
    model: transModel,
    filter: {
      userID: req.user._id,
      _id: req.params._id,
    },
  });

  if (!trx) throw new Error("user not authenticated, please log in again");

  successResp({
    res,
    status: 200,
    message: "done",
    data: trx,
  });
};

//==================================deposite==========================================
export const deposit = async (req, res, next) => {
  const { amount } = req.body;

  if (!req.bankAcc.status == statusEnum.active)
    throw new Error("account is frozen, please contact support", {
      cause: 500,
    });

  const trx = await db_service.create({
    model: transModel,
    data: {
      accID: req.bankAcc._id,
      amount,
      balanceBefore: req.bankAcc.balance,
      balanceAfter: req.bankAcc.balance + amount,
      type: transEnum.deposit,
    },
  });

  const balanceeAfter = await db_service.findOneAndUpdate({
    model: bankAccModel,
    filter: { _id: req.bankAcc._id },
    update: { balance: req.bankAcc.balance + amount },
    options: { returnDocument: "after" },
  });

  if (trx.balanceAfter !== balanceeAfter.balance) {
    db_service.updateOne({
      model: transModel,
      filter: { _id: trx._id },
      update: { status: transStatusEnum.failed },
    });
    throw new Error("Transaction was not completed, please try again");
  }

  successResp({
    res,
    status: 201,
    message: "done",
    data: trx,
  });
};

//==================================withdraw==========================================
export const withdraw = async (req, res, next) => {
  const { amount } = req.body;

  if (!req.bankAcc.status == statusEnum.active)
    throw new Error("account is frozen, please contact support", {
      cause: 500,
    });

  if (amount >> req.bankAcc.amount)
    throw new Error("insufficient funds", { cause: 500 });

  const trx = await db_service.create({
    model: transModel,
    data: {
      accID: req.bankAcc._id,
      amount,
      balanceBefore: req.bankAcc.balance,
      balanceAfter: req.bankAcc.balance - amount,
      type: transEnum.withdraw,
    },
  });

  const balanceeAfter = await db_service.findOneAndUpdate({
    model: bankAccModel,
    filter: { _id: req.bankAcc._id },
    update: { balance: req.bankAcc.balance - amount },
    options: { returnDocument: "after" },
  });

  if (trx.balanceAfter !== balanceeAfter.balance) {
    db_service.updateOne({
      model: transModel,
      filter: { _id: trx._id },
      update: { status: transStatusEnum.failed },
    });
    throw new Error("Transaction was not completed, please try again");
  }

  successResp({
    res,
    status: 201,
    message: "done",
    data: trx,
  });
};
