/** @format */

import UserModel from "../model/users.js";
import {
  reformatDate,
  constructImageUrl,
  returnCommentDetails,
} from "./utils.js";

const returnPostDetails = async (post, ownerIsRequired = true) => {
  if (!post) return null;

  const ownerThePost = await UserModel.findByPk(post.user_id, {
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

  ownerThePost.dataValues.joined_date = reformatDate(
    ownerThePost.dataValues.createdAt
  );
  ownerThePost.dataValues.joined_timestamp = ownerThePost.dataValues.createdAt;
  delete ownerThePost.dataValues.createdAt;

  const commentsData = await post.getComments();
  const commentsCount = await post.countComments();
  const comments = await Promise.all(
    commentsData.map(async (comment) => {
      return returnCommentDetails(comment);
    })
  );

  const likedUsers = await post.getLikes({
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

  const likedUsersReadable = likedUsers.map((user) => {
    user.dataValues.joined_date = reformatDate(user.dataValues.createdAt);
    user.dataValues.joined_timestamp = user.dataValues.createdAt;
    delete user.dataValues.createdAt;

    return user.get({ plain: true });
  });

  post.created_date = reformatDate(post.createdAt);
  post.owner_id = post.user_id;
  post.comments_count = commentsCount;
  post.comments = comments;

  delete post.createdAt;
  delete post.user_id;

  if (!ownerIsRequired) {
    return {
      post_id: post.post_id,
      owner_id: post.user_id,
      post_content: post.post_content,
      post_picture: constructImageUrl(post.post_picture),
      post_created_date: post.created_date,
      likes: post.likes,
      views: post.views,
      comments_count: post.comments_count,
      comments: post.comments,
    };
  }

  const [followersCount, followingCount, postsCount] = await Promise.all([
    ownerThePost.countFollowers(),
    ownerThePost.countFollowing(),
    ownerThePost.countPosts(),
  ]);

  return {
    post_id: post.post_id,
    owner_id: post.user_id,
    post_content: post.post_content,
    post_picture: constructImageUrl(post.post_picture),
    post_created_date: post.created_date,
    likes: post.likes,
    views: post.views,
    comments_count: post.comments_count,
    comments: post.comments,
    likedUsers: likedUsersReadable,
    owner_the_post: {
      ...ownerThePost.get({ plain: true }),
      profile_picture: constructImageUrl(ownerThePost.profile_picture),
      followers_count: followersCount,
      following_count: followingCount,
      posts_count: postsCount,
    },
  };
};

export { returnPostDetails };
