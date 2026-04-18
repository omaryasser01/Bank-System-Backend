import { Router } from "express";
import * as AS from "./accounts.service.js";
import { authentication } from "../../common/middleware/authentication.js";

const accRouter = Router();

accRouter.get("/me", authentication, AS.bankAccDetails);

export default accRouter;
