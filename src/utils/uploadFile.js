/** @format */
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseConfig from "../config/firebase.js";

const fileUploader = async (req) => {
  initializeApp(firebaseConfig);
  const storage = getStorage();

  const storageRef = ref(storage, `files/${Date.now()}`);

  const metadata = {
    contentType: req.file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file.buffer,
    metadata
  );

  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

export { fileUploader };
