/** @format */

import {
  tokenHelper,
  reformatDate,
  constructImageUrl,
  getUserCounts,
  fetchUserDetails,
  validateUsingRegex,
  sendResponse,
  fileUploader,
} from "../utils/utils.js";
import UserModel from "../model/users.js";

export default {
  getAllUsersPaginated: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const users = await UserModel.findAll({
        limit: limit,
        offset: offset,
        attributes: [
          "user_id",
          "username",
          "email",
          "name",
          "profile_picture",
          "bio",
          "createdAt",
        ],
      });

      if (!users.length) {
        return sendResponse(res, 404, false, "No users found");
      }

      const usersData = await Promise.all(
        users.map(async (user) => {
          const { followersCount, followingCount, postsCount, hashtagsCount } =
            await getUserCounts(user);

          const userData = user.get({ plain: true });
          userData.joined_date = reformatDate(user.createdAt);
          userData.joined_timestamp = user.createdAt;
          userData.profile_picture = constructImageUrl(user.profile_picture);
          userData.followers_count = followersCount;
          userData.following_count = followingCount;
          userData.posts_count = postsCount;
          userData.hashtags_count = hashtagsCount;

          delete userData.createdAt;

          return userData;
        })
      );
      return sendResponse(res, 200, true, "OK", usersData);
    } catch (err) {
      console.log("users.controller.js, getAllUsersPaginated: " + err.message);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  getUserDetailsByUsername: async (req, res) => {
    try {
      const { username } = req.params;

      let user = await UserModel.findOne({
        where: { username: username },
        attributes: [
          "user_id",
          "username",
          "email",
          "name",
          "profile_picture",
          "bio",
          "createdAt",
        ],
      });

      if (!user) return sendResponse(res, 404, false, `${username} not found`);

      const userDetails = await fetchUserDetails(user);
      return sendResponse(res, 200, true, "OK", { ...userDetails });
    } catch (err) {
      console.log(
        `users.controller.js, getUserDetailsByUsername: ${err.message} ${err}`
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  getCurrentUserDetails: async (req, res) => {
    try {
      const token = req.token;
      let user = await UserModel.findByPk(token.user_id, {
        attributes: [
          "user_id",
          "username",
          "email",
          "name",
          "profile_picture",
          "bio",
          "createdAt",
        ],
      });

      if (!user) return sendResponse(res, 404, false, "User not found!");

      const userDetails = await fetchUserDetails(user);
      return sendResponse(res, 200, true, "OK", { ...userDetails });
    } catch (err) {
      console.error(
        `Error occurred while getting current user details: ${err.message}`,
        err
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  editCurrentUserDetails: async (req, res) => {
    try {
      const { username, email, name, bio } = req.body;
      const token = req.token;

      let user = await UserModel.findByPk(token.user_id, {
        attributes: [
          "user_id",
          "username",
          "email",
          "name",
          "profile_picture",
          "bio",
        ],
      });

      if (!user) return sendResponse(res, 404, false, "User not found!");

      if (
        username &&
        validateUsingRegex(
          /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
          username.trim()
        )
      ) {
        let checkUsername = await UserModel.findOne({ where: { username } });
        if (checkUsername) {
          return sendResponse(res, 400, false, "Username is already taken");
        }
        user.username = username.trim();
      }

      if (
        email &&
        validateUsingRegex(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          email.trim()
        )
      ) {
        let checkEmail = await UserModel.findOne({ where: { email } });
        if (checkEmail) {
          return sendResponse(res, 400, false, "Email is already in use");
        }
        user.email = email.trim();
      }

      user.name = name || user.name;
      user.bio = bio || user.bio;

      let imageURL = "";
      if (req.file) {
        imageURL = await fileUploader(req);
        user.profile_picture = imageURL;
      }

      await user.save();

      const newToken = tokenHelper.getToken(
        {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
        },
        process.env.SECRET_KEY
      );

      return sendResponse(
        res,
        200,
        true,
        "User successfully updated!",
        newToken
      );
    } catch (err) {
      console.log(
        "users.controller.js, editCurrentUserDetails:" + err.message,
        err
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  deleteCurrentUser: async (req, res) => {
    try {
      const token = req.token;

      await UserModel.destroy({
        where: {
          user_id: token.user_id,
        },
      });
      return sendResponse(res, 204, true, "User successfully deleted!");
    } catch (err) {
      console.log(`users.controller.js, DELETE: ${err.message} ${err}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
};
