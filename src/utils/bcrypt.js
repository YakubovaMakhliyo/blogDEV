/** @format */

import bcrypt from "bcrypt";

export function passwordHash(password) {
  return bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
}

export function passwordCompare(userPasswd, dataPasswd) {
  return bcrypt.compare(userPasswd, dataPasswd);
}
