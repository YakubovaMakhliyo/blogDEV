/** @format */

import { Sequelize, Model } from "sequelize";
import db from "../config/database.js";

export default class UserModel extends Model {}

UserModel.init(
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(40),
      allowNull: false,
      unique: true,
      validate: {
        is: /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, // valid: user_name | user.name; invalid: user__name | user_.name | _username | username_,
      },
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: 8,
      },
    },
    name: Sequelize.TEXT,
    profile_picture: Sequelize.TEXT,
    bio: Sequelize.TEXT,
  },
  {
    sequelize: db,
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);
