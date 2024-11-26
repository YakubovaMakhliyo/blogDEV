/** @format */

import express from "express";
import "dotenv/config";
import cors from "cors";
import syncDB from "./config/syncDB.js";
import router from "./router/router.js";

async function startServer() {
  try {
    // INSTANCE AND ENGINE
    const app = express();
    app.use(express.json());
    app.use(cors());

    // DATABASE
    await syncDB();

    // ROUTER
    app.use(router);

    // SERVER lISTEN
    app.listen(process.env.PORT, process.env.HOST, (err) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
      console.log(`server started on port ${process.env.PORT}...`);
    });
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

startServer();
