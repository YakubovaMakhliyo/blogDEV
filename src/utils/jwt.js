/** @format */

import jwt from "jsonwebtoken";

const tokenHelper = {
  getToken: (payload, secret_key, options = {}) => {
    try {
      return jwt.sign(payload, secret_key, options);
    } catch (error) {
      console.log(`jwt: ${error.message}`);
    }
  },

  verifyToken: (token, secret_key) => {
    try {
      return jwt.verify(token, secret_key);
    } catch (error) {
      console.log(`jwt: ${error.message}`);
      return undefined;
    }
  },
};

export { tokenHelper };
