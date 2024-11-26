/** @format */

import { Sequelize, Model } from "sequelize";
import db from "../config/database.js";
import PostModel from "./posts.js";
import UserModel from "./users.js";

export default class CommentModel extends Model {}

CommentModel.init(
  {
    comment_id: {
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
    comment_content: Sequelize.TEXT,
  },
  {
    sequelize: db,
    tableName: "comments",
  }
);
