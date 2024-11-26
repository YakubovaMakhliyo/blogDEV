/** @format */
import { Router } from "express";
import loginController from "../controller/loginController.js";
import registerController from "../controller/register.controller.js";
import { loginValidator, registerValidator } from "../middleware/validator.js";

const authRouter = Router();

// REGISTER
authRouter.post("/register",  registerController);

// LOGIN
authRouter.post("/login", loginValidator, loginController);

export default authRouter;
