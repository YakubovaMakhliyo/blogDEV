/** @format */

import { tokenHelper } from "../utils/utils.js";

export default async function (req, res) {
  try {
    const user = req.user;

    const token = tokenHelper.getToken(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
      process.env.SECRET_KEY
    );

    res
      .status(200)
      .json({ user_id: user.user_id, username: user.username, token });
  } catch (err) {
    console.log("loginController.js: " + err.message);
    res.status(500).send(`Internal server error: ${err.message}`);
  }
}
