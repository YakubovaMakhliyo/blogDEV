/** @format */
import { Router } from "express";
import commentsCT from "../controller/comments.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const commentsRouter = Router();

commentsRouter.get(
  "/comments-of-the-post/:post_id",
  commentsCT.getPostComments
);
commentsRouter.post("/comment/:post_id", checkToken, commentsCT.createComment);
commentsRouter.delete(
  "/comment/:comment_id",
  checkToken,
  commentsCT.deleteComment
);

export default commentsRouter;
