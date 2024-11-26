/** @format */

import { passwordCompare } from "../utils/bcrypt.js";
import UserModel from "../model/users.js";

export async function registerValidator(req, res, next) {
  let { username, email, password } = req.body;

  if (typeof password == "number") {
    return res
      .status(400)
      .json({ error: "The password must contain a letter" });
  }
  if (!username?.trim() || !password?.trim() || !email?.trim())
    return res.status(400).json({ error: "Please fill all the fields!" });

  const usernameRegex =
    /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!usernameRegex.test(username.trim()))
    return res.status(400).json({ error: "Username format incorrect!" });

  if (!emailRegex.test(email.trim()))
    return res.status(400).json({ error: "Email format incorrect!!" });

  if (password.trim().length < 8)
    return res
      .status(400)
      .json({ error: "Password must not be less than 8 characters" });

  const user = await UserModel.findOne({ where: { email, username } });

  if (user)
    return res.status(400).json({
      error: `Already registered with this username or email!`,
    });

  next();
}

export const loginValidator = async (req, res, next) => {
  const { login, password } = req.body;

  if (!login || !password)
    return res.status(400).json({ error: "Please fill all the fields!" });

  const user = login.includes("@")
    ? await UserModel.findOne({ where: { email: login } })
    : await UserModel.findOne({ where: { username: login } });

  if (!user) return res.status(404).json({ error: "User not found!" });

  const isValidPassword = await passwordCompare(password, user.password);
  if (!isValidPassword)
    return res.status(400).json({ error: "Password wrong!" });

  req.user = user;
  next();
};
