/** @format */

import CommentModel from "../model/comments.js";
import PostModel from "../model/posts.js";

import { returnCommentDetails, sendResponse } from "../utils/utils.js";

export default {
  getPostComments: async (req, res) => {
    try {
      const { post_id } = req.params;

      const post = await PostModel.findByPk(isNaN(post_id) ? 0 : post_id);
      if (!post) return sendResponse(res, 404, false, "Post not found!");

      const comments = await post.getComments();
      const responseData = await Promise.all(
        comments.map(async (comment) => {
          return returnCommentDetails(comment);
        })
      );

      return sendResponse(res, 200, true, `OK`, responseData);
    } catch (err) {
      console.log(
        `comments.controller.js, getPostComments: ${err.message} ${err}`
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  createComment: async (req, res) => {
    try {
      const { comment_content } = req.body;
      const { post_id } = req.params;
      const { user_id } = req.token;

      const post = await PostModel.findByPk(isNaN(post_id) ? 0 : post_id);
      if (!post) return sendResponse(res, 404, false, "Post not found!");

      const comment = await CommentModel.create({
        user_id,
        post_id,
        comment_content,
      });

      const responseData = await returnCommentDetails(comment);
      return sendResponse(
        res,
        201,
        true,
        `Comment created successfully!`,
        responseData
      );
    } catch (err) {
      console.log(
        `comments.controller.js, createComment: ${err.message} ${err}`
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { comment_id } = req.params;
      const { user_id } = req.token;

      const comment = await CommentModel.findOne({
        where: {
          comment_id: isNaN(comment_id) ? 0 : comment_id,
          user_id,
        },
      });

      if (!comment) {
        return sendResponse(
          res,
          404,
          false,
          "Comment not found or you do not have permission to delete it!"
        );
      }

      await comment.destroy();
      return sendResponse(
        res,
        200,
        true,
        `Comment on ID:${comment_id} deleted successfully!`
      );
    } catch (err) {
      console.log(
        `comments.controller.js, deleteComment: ${err.message} ${err}`
      );
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  },
};
