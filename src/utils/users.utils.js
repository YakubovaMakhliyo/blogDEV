/** @format */

import { reformatDate, constructImageUrl, returnPostDetails } from "./utils.js";

async function returnFollowersDetails(user, userMethod) {
  const data = await user[userMethod]({
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
  return data.map((follower) => {
    follower.dataValues.joined_date = reformatDate(follower.createdAt);
    follower.dataValues.joined_timestamp = follower.createdAt;
    follower.profile_picture = constructImageUrl(follower.profile_picture);
    delete follower.dataValues.FollowerModel;
    delete follower.dataValues.createdAt;
    return follower.get({ plain: true });
  });
}

async function returnPostsDetails(user) {
  const posts = await user.getPosts();
  const responseData = await Promise.all(
    posts.map(async (post) => {
      return await returnPostDetails(post);
    })
  );
  return responseData;
}

async function getUserCounts(user) {
  const tasks = [
    "countFollowers",
    "countFollowing",
    "countPosts",
    "countHashtags",
  ].map((method) => user[method]());
  const [followersCount, followingCount, postsCount, hashtagsCount] =
    await Promise.all(tasks);
  return { followersCount, followingCount, postsCount, hashtagsCount };
}

async function fetchUserDetails(user) {
  const { followersCount, followingCount, postsCount, hashtagsCount } =
    await getUserCounts(user);
  const followers = await returnFollowersDetails(user, "getFollowers");
  const following = await returnFollowersDetails(user, "getFollowing");
  const posts = await returnPostsDetails(user);

  user = user.get({ plain: true });
  user.profile_picture = constructImageUrl(user.profile_picture);
  user.joined_date = reformatDate(user.createdAt);
  user.joined_timestamp = user.createdAt;
  user.followers_count = followersCount;
  user.following_count = followingCount;
  user.posts_count = postsCount;
  user.hashtags_count = hashtagsCount;
  user.followers = followers;
  user.following = following;
  user.posts = posts;
  delete user.createdAt;

  return user;
}

export {
  returnFollowersDetails,
  returnPostsDetails,
  getUserCounts,
  fetchUserDetails,
};
