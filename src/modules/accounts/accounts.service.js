import * as db_service from "../../DB/models/db.service.js";
import { successResp } from "../../common/utils/resp.succ.js";

//==================================Bank account details===============================
export const bankAccDetails = async (req, res, next) => {
  successResp({
    res,
    status: 200,
    message: "done",
    data: req.bankAcc._doc,
  });
};
