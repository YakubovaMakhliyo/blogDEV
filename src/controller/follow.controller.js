/** @format */

import UserModel from "../model/users.js";

async function fetchUser(username) {
  return await UserModel.findOne({ where: { username } });
}

function sendResponse(
  res,
  status,
  ok,
  isCurrentUser,
  isAlreadyFollowed,
  message,
  data = null
) {
  res.status(status).json({
    status,
    ok,
    isCurrentUser,
    isAlreadyFollowed,
    message,
    data,
  });
}

async function userAlreadyFollowing(currentUser, targetName) {
  let followings = await currentUser.getFollowing();
  return followings.some((user) => user && user.username == targetName);
}

export default {
  follow: async (req, res) => {
    const { targetName } = req.params;
    const sourceName = req.token.username;
    let isCurrentUser = false;
    let ok = false;

    if (targetName == sourceName) {
      isCurrentUser = true;
      return sendResponse(
        res,
        400,
        ok,
        isCurrentUser,
        false,
        "You don't follow yourself"
      );
    }

    const [currentUser, targetUser] = await Promise.all([
      fetchUser(sourceName),
      fetchUser(targetName),
    ]);

    if (!targetUser) {
      return sendResponse(
        res,
        404,
        ok,
        isCurrentUser,
        false,
        "Target user does not exist"
      );
    }

    const previously_subscribed = await userAlreadyFollowing(
      currentUser,
      targetName
    );

    if (previously_subscribed) {
      return sendResponse(
        res,
        400,
        ok,
        isCurrentUser,
        true,
        "You have already subscribed to this user"
      );
    }

    await currentUser.addFollowing(targetUser);
    ok = true;
    sendResponse(res, 200, ok, isCurrentUser, false, "Followed");
  },

  unFollow: async (req, res) => {
    const { targetName } = req.params;
    const sourceName = req.token.username;
    let isCurrentUser = false;
    let ok = false;

    if (targetName == sourceName) {
      isCurrentUser = true;
      return sendResponse(
        res,
        400,
        ok,
        isCurrentUser,
        false,
        "You don't unFollow yourself"
      );
    }

    const [currentUser, targetUser] = await Promise.all([
      fetchUser(sourceName),
      fetchUser(targetName),
    ]);

    if (!targetUser) {
      return sendResponse(
        res,
        404,
        ok,
        isCurrentUser,
        false,
        "Target user does not exist"
      );
    }

    const previously_subscribed = await userAlreadyFollowing(
      currentUser,
      targetName
    );

    if (previously_subscribed) {
      await currentUser.removeFollowing(targetUser);
      return sendResponse(res, 200, true, isCurrentUser, false, "unFollowed");
    }

    sendResponse(
      res,
      400,
      ok,
      isCurrentUser,
      false,
      "You are not subscribed to this user yet"
    );
  },
};
