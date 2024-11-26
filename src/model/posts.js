/** @format */

import { Sequelize, Model } from "sequelize";
import db from "../config/database.js";
import UserModel from "./users.js";

export default class PostModel extends Model {}

PostModel.init(
  {
    post_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "user_id",
      },
    },
    post_picture: Sequelize.TEXT,
    post_content: Sequelize.TEXT,
    likes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    views: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // isLiked: {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // },
  },
  {
    sequelize: db,
    tableName: "posts",
    timestamps: true,
    paranoid: true,
  }
);
