import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.js";

const UserRouter = Router();

UserRouter.post("/register", US.registerUser);
UserRouter.post("/login", US.login);



export default UserRouter;
