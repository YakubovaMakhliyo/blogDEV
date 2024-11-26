/** @format */

import db from "./database.js";
import UserModel from "../model/users.js";
import FollowerModel from "../model/followers.js";
import PostModel from "../model/posts.js";
import LikeModel from "../model/likes.js";
import CommentModel from "../model/comments.js";
import HashtagModel from "../model/hashtags.js";

export default async function syncDB() {
  db.authenticate()
    .then(() => {
      console.log("successfully connect to DB");
    })
    .catch((err) => {
      console.error(`Failed connect to DB: `, err);
    });

  UserModel.belongsToMany(UserModel, {
    through: FollowerModel,
    as: "followers",
    foreignKey: "target_id",
    otherKey: "source_id",
  });
  UserModel.belongsToMany(UserModel, {
    through: FollowerModel,
    as: "following",
    foreignKey: "source_id",
    otherKey: "target_id",
  });

  UserModel.hasMany(PostModel, { foreignKey: "user_id", as: "Posts" });
  UserModel.hasMany(HashtagModel, { foreignKey: "user_id", as: "Hashtags" });
  UserModel.belongsToMany(PostModel, {
    through: LikeModel,
    foreignKey: "user_id",
    as: "Likes",
  });

  //PostModel
  PostModel.hasMany(CommentModel, { foreignKey: "post_id", as: "Comments" });
  PostModel.hasMany(HashtagModel, { foreignKey: "post_id", as: "Hashtags" });
  PostModel.belongsTo(UserModel, { foreignKey: "user_id", as: "User" });
  PostModel.belongsToMany(UserModel, {
    through: LikeModel,
    foreignKey: "post_id",
    as: "Likes",
  });

  // LikeModel
  LikeModel.belongsTo(UserModel, { foreignKey: "user_id", as: "likedUser" });
  LikeModel.belongsTo(PostModel, { foreignKey: "post_id", as: "Post" });
  UserModel.belongsToMany(PostModel, {
    through: LikeModel,
    foreignKey: "user_id",
  });
  PostModel.belongsToMany(UserModel, {
    through: LikeModel,
    foreignKey: "post_id",
  });

  //CommentModel
  CommentModel.belongsTo(PostModel, { foreignKey: "post_id", as: "Post" });
  CommentModel.belongsTo(UserModel, { foreignKey: "user_id", as: "User" });

  //HashtagModel
  HashtagModel.belongsTo(PostModel, { foreignKey: "post_id", as: "Post" });
  HashtagModel.belongsTo(UserModel, { foreignKey: "user_id", as: "User" });

  db.sync({ alter: true }).catch((err) => {
    console.error("Error syncing the database", err);
  });
}
