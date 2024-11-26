/** @format */

import sequelize from "../config/database.js";
import LikeModel from "../model/likes.js";
import PostModel from "../model/posts.js";
import UserModel from "../model/users.js";
import { returnPostDetails, sendResponse } from "../utils/utils.js";

async function likePost(user_id, post_id) {
  const t = await sequelize.transaction();

  try {
    const existingLike = await LikeModel.findOne({
      where: { user_id, post_id },
      transaction: t,
    });

    if (existingLike) {
      return {
        status: 400,
        ok: false,
        message: "Post has already been liked by the user",
      };
    }

    await LikeModel.create({ user_id, post_id }, { transaction: t });

    const likesCount = await LikeModel.count({
      where: { post_id },
      transaction: t,
    });

    await PostModel.update(
      { likes: likesCount },
      { where: { post_id }, transaction: t }
    );

    await t.commit();
    return {
      status: 201,
      ok: true,
      message: `Post on ID: ${post_id} liked!`,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}
async function unlikePost(user_id, post_id) {
  const t = await sequelize.transaction();

  try {
    const existingLike = await LikeModel.findOne({
      where: { user_id, post_id },
      transaction: t,
    });

    if (!existingLike)
      return {
        status: 400,
        ok: false,
        message: "Post has not been liked by the user yet",
      };

    await LikeModel.destroy({ where: { user_id, post_id }, transaction: t });

    const likesCount = await LikeModel.count({
      where: { post_id },
      transaction: t,
    });

    await PostModel.update(
      { likes: likesCount },
      { where: { post_id }, transaction: t }
    );

    await t.commit();
    return {
      status: 200,
      ok: true,
      message: `Post on ID: ${post_id} unLiked!`,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export default {
  like: async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id } = req.token;

      const post = await PostModel.findByPk(isNaN(post_id) ? 0 : post_id);
      if (!post) return sendResponse(res, 404, false, "Post not found!");

      const { status, ok, message } = await likePost(user_id, post_id);
      return sendResponse(res, status, ok, message);
    } catch (err) {
      console.log(`likes.controller.js like: ${err.message} ${err}`);
      res.status(500).send(`Internal server error: ${err.message}`);
    }
  },
  unLike: async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id } = req.token;

      const post = await PostModel.findByPk(isNaN(post_id) ? 0 : post_id);
      if (!post) return sendResponse(res, 404, false, "Post not found!");

      const { status, ok, message } = await unlikePost(user_id, post_id);
      return sendResponse(res, status, ok, message);
    } catch (err) {
      console.log(`likes.controller.js unLike: ${err.message} ${err}`);
      res.status(500).send(`Internal server error: ${err.message}`);
    }
  },
  likedPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const userId = req.token.user_id;
      const user = await UserModel.findByPk(userId);

      const LikedPosts = await user.getLikes({
        limit: limit,
        offset: offset,
      });
      const likedPostsReadable = await Promise.all(
        LikedPosts.map(async (post) => {
          return await returnPostDetails(post);
        })
      );

      res.status(200).json({ data: likedPostsReadable });
    } catch (err) {
      console.log(`likes.controller.js likedPosts: ${err.message} ${err}`);
      res.status(500).send(`Internal server error: ${err.message}`);
    }
  },
  otherLikedPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { username } = req.params;
      const user = await UserModel.findOne({ where: { username: username } });

      const LikedPosts = await user.getLikes({
        limit: limit,
        offset: offset,
      });
      const likedPostsReadable = await Promise.all(
        LikedPosts.map(async (post) => {
          return await returnPostDetails(post);
        })
      );

      res.status(200).json({ data: likedPostsReadable });
    } catch (err) {
      console.log(`likes.controller.js likedPosts: ${err.message} ${err}`);
      res.status(500).send(`Internal server error: ${err.message}`);
    }
  },
};
