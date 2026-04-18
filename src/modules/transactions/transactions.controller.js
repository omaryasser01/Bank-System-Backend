import { Router } from "express";
import { authentication } from "../../common/middleware/authentication.js";
import * as TS from "./transactions.service.js";

const trxRouter = Router();

trxRouter.get("/me", authentication, TS.trxDetails);
trxRouter.get("/:_id", authentication, TS.singleTrxDetails);
trxRouter.post("/deposit", authentication, TS.deposit);
trxRouter.post("/withdraw", authentication, TS.withdraw);

export default trxRouter;
