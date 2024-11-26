/** @format */

import { Router } from "express";
import searchCT from "../controller/search.controller.js";

const searchRouter = Router();

// SEARCH USERS
searchRouter.get("/", searchCT.SEARCH_USERS);

export default searchRouter;
