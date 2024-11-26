/** @format */

import { tokenHelper } from "../utils/utils.js";
import UserModel from "../model/users.js";

export const checkToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token)
      return res.status(401).json({
        status: 401,
        data: null,
        msg: "autentifikatsion token mavjud emas",
      });

    const decodedToken = tokenHelper.verifyToken(token, process.env.SECRET_KEY);
    if (!decodedToken)
      return res.status(403).json({
        status: 403,
        data: null,
        msg: "autentifikatsion token yaroqsiz",
      });

    const user = await UserModel.findOne({
      where: {
        email: decodedToken.email,
        username: decodedToken.username,
      },
    });

    if (!user)
      return res
        .status(403)
        .json({ status: 403, data: null, msg: "Forbidden" });

    req.token = decodedToken;

    next();
  } catch (err) {
    console.log(`checkToken.js ${err.message} ${err}`);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
};
