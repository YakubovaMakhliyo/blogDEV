/** @format */

import { join } from "path";
import fs from "fs";

export const imgViewer = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File does not exist");
    }

    res.sendFile(filePath);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send(`Could not process image ${filename}: ${error.message}`);
  }
};
