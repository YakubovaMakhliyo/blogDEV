/** @format */

import { passwordCompare, passwordHash } from "./bcrypt.js";
import { tokenHelper } from "./jwt.js";
import { reformatDate } from "./reformatDate.js";
import {
  returnFollowersDetails,
  returnPostsDetails,
  getUserCounts,
  fetchUserDetails,
} from "./users.utils.js";
import { returnPostDetails } from "./posts.utils.js";
import { returnCommentDetails } from "./comments.utils.js";
import { fileUploader } from "./uploadFile.js";

const constructImageUrl = (pictureURL) => {
  if (pictureURL) {
    return pictureURL;
  } else {
    return "";
  }
};
const validateUsingRegex = (regex, testString) => {
  return regex.test(testString);
};

const sendResponse = (res, status, ok, message, data = null) => {
  return res.status(status).json({ status, ok, message, data });
};

export {
  passwordCompare,
  passwordHash,
  tokenHelper,
  reformatDate,
  constructImageUrl,
  validateUsingRegex,
  sendResponse,
  fileUploader,
  returnFollowersDetails,
  returnPostsDetails,
  getUserCounts,
  fetchUserDetails,
  returnPostDetails,
  returnCommentDetails,
};
