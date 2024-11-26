/** @format */

import { Router } from "express";
import upload from "../config/multer.conf.js";
import postsCT from "../controller/posts.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const postsRouter = Router();

postsRouter.get("/public", postsCT.getAllPostsPaginated);
postsRouter.get("/my-posts", checkToken, postsCT.getCurrentUserPosts);
postsRouter.get(
  "/followed-posts",
  checkToken,
  postsCT.getCurrentUserFollowedPosts
);
postsRouter.get("/:post_id", postsCT.getPostById);
postsRouter.post(
  "/create",
  upload.single("post_picture"),
  checkToken,
  postsCT.createNewPost
);
postsRouter.delete("/:post_id", checkToken, postsCT.deleteExistingPost);

export default postsRouter;
