import dotenv from "dotenv";
import { resolve } from "node:path";

let envpath = {
  development: ".env.development",
  production: ".env.production",
};

dotenv.config({ path: resolve(`config/${envpath[process.env.NODE_ENV]}`) });

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const SECRET_KEY = process.env.SECRET_KEY;
export const saltRounds = process.env.saltRounds;
