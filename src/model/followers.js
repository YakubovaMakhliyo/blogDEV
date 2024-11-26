/** @format */

import { Sequelize, Model } from "sequelize";
import db from "../config/database.js";
import UserModel from "./users.js";

export default class FollowerModel extends Model {}

FollowerModel.init(
  {
    follower_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "user_id",
      },
    },
    target_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "user_id",
      },
    },
  },
  {
    sequelize: db,
    tableName: "followers",
    timestamps: false,
  }
);
