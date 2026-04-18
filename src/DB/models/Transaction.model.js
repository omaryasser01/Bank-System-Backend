import mongoose from "mongoose";
import { transEnum, transStatusEnum } from "../../common/enum/user.enum.js";

const transSchema = mongoose.Schema(
  {
    accID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bankAcc",
      trim: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    balanceBefore: {
      type: Number,
      trim: true,
    },
    balanceAfter: {
      type: Number,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(transEnum),
    },
    status: {
      type: String,
      enum: Object.values(transStatusEnum),
      default: transStatusEnum.completed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const transModel =
  mongoose.model("trans", transSchema) || mongoose.models.trans;

export default transModel;
