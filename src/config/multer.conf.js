/** @format */

import multer from "multer";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
// import { join, extname } from "path";
// import firebaseConfig from "./firebase.js";

// initializeApp(firebaseConfig);

// const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, join(process.cwd(), "uploads")),
//   filename: (req, file, cb) =>
//     cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`),
// });

// const upload = multer({ storage: storage });

export default upload;
