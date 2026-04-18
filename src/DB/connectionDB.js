import mongoose from "mongoose";
import { MONGO_URI } from "../../config/config.service.js";

const checkDBconnection = async () => {
  await mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("connected to DB successfully");
    })
    .catch((err) => {
      console.log("failed to connect to DB", err);
    });
};

export default checkDBconnection;
