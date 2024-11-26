/** @format */

import { Sequelize } from "sequelize";

export default new Sequelize(process.env.DB_CONNECT, {
  logging: false,
  dialectOptions: {
    charset: "utf8",
    collate: "utf8_unicode_ci",
    // ssl: true,
    // native: true,
  },
});
