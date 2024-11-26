/** @format */

import { Router } from "express";
import { imgViewer } from "../controller/img.controller.js";
import authRouter from "./auth.routes.js";
import searchRouter from "./search.routes.js";
import usersRouter from "./users.routes.js";
import followRouter from "./follow.routes.js";
import postsRouter from "./posts.routes.js";
import commentsRouter from "./comments.routes.js";
import likesRouter from "./likes.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/search", searchRouter);
router.use("/follow", followRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/likes", likesRouter);
router.get("/img/:filename", imgViewer);

export default router;
