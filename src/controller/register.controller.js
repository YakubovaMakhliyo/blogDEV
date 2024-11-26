/** @format */

import { passwordHash } from "../utils/bcrypt.js";
import UserModel from "../model/users.js";

export default async function (req, res) {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await passwordHash(password);

    let user = new UserModel({
      username,
      email,
      password: hashedPassword,
      name: username,
    });

    await user.save();

    res.redirect(201, "/auth/login");
  } catch (err) {
    console.log("register.controller.js: " + err.message);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
}
