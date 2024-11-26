/** @format */

import { Router } from "express";
import followCT from "../controller/follow.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const followRouter = Router();

// FOLLOW
followRouter.post("/:targetName", checkToken, followCT.follow);

// UNFOLLOW
followRouter.delete("/:targetName", checkToken, followCT.unFollow);

export default followRouter;
