/** @format */

import { Router } from "express";
import upload from "../config/multer.conf.js";
import usersCT from "../controller/users.controller.js";
import { checkToken } from "../middleware/checkToken.js";

const usersRouter = Router();

// GET USER AND USERS INFORMATION
usersRouter.get("/public", usersCT.getAllUsersPaginated);
usersRouter.get("/me", checkToken, usersCT.getCurrentUserDetails);
usersRouter.get("/:username", usersCT.getUserDetailsByUsername);

// PUT(EDIT) USER INFORMATION
usersRouter.put(
  "/me",
  upload.single("profile_pic"),
  checkToken,
  usersCT.editCurrentUserDetails
);

// DELETE USER
usersRouter.delete("/me", checkToken, usersCT.deleteCurrentUser);

export default usersRouter;
