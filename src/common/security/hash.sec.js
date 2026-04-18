import { hashSync, compareSync } from "bcrypt";
import { saltRounds } from "../../../config/config.service.js";

export const hash = async ({ plainText, saltsRounds = saltRounds }) => {
  return hashSync(plainText, Number(saltsRounds));
};

export const compare = async ({ plainText, hashText }) => {
  return compareSync(plainText, hashText);
};
