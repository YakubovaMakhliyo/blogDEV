/** @format */

import { Op } from "sequelize";
import UserModel from "../model/users.js";
import { constructImageUrl, sendResponse } from "../utils/utils.js";

export default {
  SEARCH_USERS: async (req, res) => {
    try {
      const { query } = req.query;
      const q = query.toLowerCase();
      let users = await UserModel.findAll({
        where: {
          username: {
            [Op.like]: `%${q}%`,
          },
        },
        attributes: [
          "user_id",
          "username",
          "email",
          "name",
          "profile_picture",
          "bio",
        ],
        raw: true,
      });

      let responseData = await Promise.all(
        users.map(async (user) => {
          let dbUser = await UserModel.findByPk(user.user_id);
          let followersCount = await dbUser.countFollowers();
          let followingCount = await dbUser.countFollowing();
          let postsCount = await dbUser.countPosts();
          let followers = await dbUser.getFollowers({
            attributes: [
              "user_id",
              "username",
              "email",
              "name",
              "profile_picture",
              "bio",
            ],
          });

          return {
            ...user,
            profile_picture: constructImageUrl(user.profile_picture),
            followers_count: followersCount,
            following_count: followingCount,
            posts_count: postsCount,
            followers: followers,
          };
        })
      );
      return sendResponse(res, 200, true, "OK", responseData);
    } catch (err) {
      console.error("search.controller.js, SEARCH_USER:", err.message);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
};
