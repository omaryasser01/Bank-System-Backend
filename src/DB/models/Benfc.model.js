import mongoose from "mongoose";

const benfSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      trim: true,
    },
    accID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bankAcc",
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    nickName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const benfModel = mongoose.model("benf", benfSchema) || mongoose.models.benf;

export default benfModel;
