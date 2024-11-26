/** @format */

import UserModel from "../model/users.js";
import { constructImageUrl, reformatDate } from "./utils.js";

const returnCommentDetails = async (comment) => {
  if (!comment) return null;

  const ownerTheComment = await UserModel.findByPk(comment.user_id, {
    attributes: [
      "user_id",
      "username",
      "email",
      "name",
      "profile_picture",
      "bio",
    ],
  });

  comment.created_date = reformatDate(comment.createdAt);
  comment.owner_id = comment.user_id;

  delete comment.createdAt;
  delete comment.user_id;

  const [followersCount, followingCount, commentsCount] = await Promise.all([
    ownerTheComment.countFollowers(),
    ownerTheComment.countFollowing(),
    ownerTheComment.countPosts(),
  ]);

  return {
    comment_id: comment.comment_id,
    comment_content: comment.comment_content,
    owner_id: comment.user_id,
    owner_the_comment: {
      ...ownerTheComment.get({ plain: true }),
      profile_picture: constructImageUrl(ownerTheComment.profile_picture),
      followers_count: followersCount,
      following_count: followingCount,
      comments_count: commentsCount,
    },
  };
};

export { returnCommentDetails };
