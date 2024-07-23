import conn from "../../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Handling GET request for fetching contact details
  if (req.method == "GET") {
    try {
      // Query the database to fetch all contact details
      const fetchQuery = "SELECT * FROM `yt_video` ORDER BY id DESC";
      // Execute the query
      const [rows] = await conn.query(fetchQuery);
      console.log(rows);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }

  if (req.method == "POST") {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      console.log(fields);
      const { title, short_desc, link } = fields;

      const oldPath = files.thumbnail[0].filepath; // Access the path of the uploaded image
      // new path
      const nFileName = `${Date.now()}.${files.thumbnail[0].originalFilename}`;
      // remove space
      const newFileName = nFileName.replace(/\s/g, "");
      // project dir
      const projectDirectory = path.resolve(
        __dirname,
        "../../../../../../public/assets/upload/about/videos"
      );
      // combine path and image name
      const newPath = path.join(projectDirectory, newFileName);

      // copy img from old path to new path
      fs.copyFile(oldPath, newPath, async (moveErr) => {
        if (moveErr) {
          console.log(moveErr);
          res.status(500).json({ message: "File Upload failed." });
        } else {
          try {
            // db operation
            const [row] = await conn.query("INSERT INTO yt_video SET ? ", {
              title: title,
              short_desc: short_desc,
              link: link,
              thumbnail: newFileName,
              status: 1,
            });
            res.status(200).json(row);
          } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to Add Product Category" });
          } finally {
            conn.releaseConnection();
          }
        }
      });
    });
  }
}
