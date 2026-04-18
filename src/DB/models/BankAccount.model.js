import mongoose from "mongoose";
import { statusEnum } from "../../common/enum/user.enum.js";

const bankAccSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
    accountNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(statusEnum),
      default: statusEnum.active,
    },
  },
  {
    timestamps: true,
  },
);

const bankAccModel =
  mongoose.model("bankAcc", bankAccSchema) || mongoose.models.bankAcc;

export default bankAccModel;
