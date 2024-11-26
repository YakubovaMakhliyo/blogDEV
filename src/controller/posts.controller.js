/** @format */

import PostModel from "../model/posts.js";
import UserModel from "../model/users.js";
import {
  sendResponse,
  returnPostDetails,
  fileUploader,
} from "../utils/utils.js";

export default {
  getAllPostsPaginated: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const posts = await PostModel.findAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      let responseData = await Promise.all(
        posts.map(async (post) => {
          return returnPostDetails(post);
        })
      );

      return sendResponse(res, 200, true, `OK`, responseData);
    } catch (err) {
      console.log(
        `posts.controller.js, getAllPostsPaginated: ${err.message} ${err}`
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  getCurrentUserPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { user_id } = req.token;

      const user = await UserModel.findByPk(user_id);
      const userPosts = await user.getPosts({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const responseData = await Promise.all(
        userPosts.map(async (post) => {
          return returnPostDetails(post, true);
        })
      );

      return sendResponse(res, 200, true, `OK`, responseData);
    } catch (err) {
      console.log(
        `posts.controller.js, getCurrentUserPosts: ${err.message} ${err}`
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  getCurrentUserFollowedPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { user_id } = req.token;

      const user = await UserModel.findByPk(user_id);
      const userFollowings = await user.getFollowing();

      let responseData = [];

      const postsPromises = userFollowings.map(async (follower) => {
        const followerPosts = await follower.getPosts({
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        });

        const details = await Promise.all(
          followerPosts.map((post) => returnPostDetails(post))
        );

        responseData = [...responseData, ...details];
      });

      await Promise.all(postsPromises);

      return sendResponse(res, 200, true, `OK`, responseData);
    } catch (err) {
      console.log(
        `posts.controller.js, getCurrentUserFollowedPosts: ${err.message} ${err}`
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  getPostById: async (req, res) => {
    try {
      const { post_id } = req.params;

      const post = await PostModel.findByPk(isNaN(post_id) ? 0 : post_id);
      if (!post) return sendResponse(res, 404, false, "Post not found!");

      let responseData = await returnPostDetails(post);
      return sendResponse(res, 200, true, `OK`, responseData);
    } catch (err) {
      console.log(`posts.controller.js, getPostById: ${err.message} ${err}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  createNewPost: async (req, res) => {
    try {
      const { post_content } = req.body;
      const { user_id } = req.token;

      let imageURL = "";
      if (req.file) {
        imageURL = await fileUploader(req);
      }

      const post = await PostModel.create({
        user_id,
        post_content,
        post_picture: imageURL,
      });

      let responseData = await returnPostDetails(post, false);

      sendResponse(res, 201, true, `post created successfully`, responseData);
    } catch (err) {
      console.log(`posts.controller.js, createPost: ${err.message} ${err}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  deleteExistingPost: async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id } = req.token;

      const post = await PostModel.findOne({
        where: {
          post_id: post_id,
          user_id: user_id,
        },
      });

      if (!post) {
        return sendResponse(
          res,
          404,
          false,
          "Post not found or you do not have permission to delete it!"
        );
      }

      await post.destroy();
      return sendResponse(
        res,
        200,
        true,
        `Post on ID:${post_id} deleted successfully!`
      );
    } catch (err) {
      console.log(`posts.controller.js, deletePost: ${err.message} ${err}`);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
};
