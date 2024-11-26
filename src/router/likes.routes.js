/** @format */

import { Router } from "express";
import likesCT from "../controller/likes.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const likesRouter = Router();

likesRouter.get("/", checkToken, likesCT.likedPosts);
likesRouter.get("/:username", likesCT.otherLikedPosts);
likesRouter.post("/:post_id", checkToken, likesCT.like);
likesRouter.delete("/:post_id", checkToken, likesCT.unLike);

export default likesRouter;
