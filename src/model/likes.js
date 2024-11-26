/** @format */

import { Sequelize, Model } from "sequelize";
import db from "../config/database.js";
import PostModel from "./posts.js";
import UserModel from "./users.js";

export default class LikeModel extends Model {}

LikeModel.init(
  {
    like_id: {
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
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: PostModel,
        key: "post_id",
      },
    },
  },
  {
    sequelize: db,
    tableName: "likes",
    timestamps: false,
  }
);
