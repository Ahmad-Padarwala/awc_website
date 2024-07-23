import nodemailer from "nodemailer";
import conn from "../../dbconfig/conn";
import path from "path";
import fs from "fs";
import { IncomingForm } from "formidable";
const { unlink } = require("fs").promises;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      // Get the video thumbnail file name from the database
      const [video] = await conn.query(
        "SELECT thumbnail FROM yt_video WHERE id = ?",
        [id]
      );

      // Query to delete the video
      const deleteQuery = "DELETE FROM yt_video WHERE id = ?";

      // Execute the delete query
      const [rows] = await conn.query(deleteQuery, [id]);

      let videoThumbnail = "";
      if (video.length !== 0) {
        videoThumbnail = video[0].thumbnail;

        // Define the project directory and the path to the video thumbnail
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/about/videos"
        );
        const thumbnailPath = path.join(projectDirectory, videoThumbnail);

        // Delete the video thumbnail file
        try {
          await fs.access(thumbnailPath);
          console.log(`Deleting file: ${thumbnailPath}`);
          await fs.unlink(thumbnailPath);
        } catch (error) {
          console.error(
            `File not found or could not be deleted: ${thumbnailPath}`
          );
        }
      }

      // Send a success response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Cannot Delete Video... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method === "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        // Check if the file exists
        const { title, short_desc, link } = fields;

        const [video] = await conn.query(
          "SELECT thumbnail FROM yt_video WHERE id = ?",
          [id]
        );

        let sql = "";
        let params = [];
        let result = "";

        if (!files.thumbnail) {
          // Update without changing thumbnail
          sql =
            "UPDATE `yt_video` SET `title`= ?, `short_desc`= ?, `link`= ? WHERE id = ?";
          params = [title, short_desc, link, id];
          result = await conn.query(sql, params);
        } else {
          // Update with changing thumbnail
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
          const fileExtension = path
            .extname(files.thumbnail[0].originalFilename)
            .toLowerCase();

          if (!allowedImageExtensions.includes(fileExtension)) {
            return res
              .status(400)
              .json({ message: "Only image files are allowed." });
          }

          const oldPath = files.thumbnail[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${
            files.thumbnail[0].originalFilename
          }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../../public/assets/upload/about/videos"
          );
          const newPath = path.join(projectDirectory, newFileName);

          // Copy the new image from the old path to the new path
          fs.copyFile(oldPath, newPath, (moveErr) => {
            if (moveErr) {
              console.log(moveErr);
              return res.status(500).json({ message: "File move failed." });
            }
          });

          sql =
            "UPDATE `yt_video` SET `title`= ?, `short_desc`= ?, `link`= ?, `thumbnail`= ? WHERE id = ?";
          params = [title, short_desc, link, newFileName, id];
          result = await conn.query(sql, params);

          if (video.length !== 0) {
            const oldImage = video[0].thumbnail;
            const oldImagePath = path.join(projectDirectory, oldImage);
            try {
              await fs.access(oldImagePath);
              console.log(`Deleting file: ${oldImagePath}`);
              await fs.unlink(oldImagePath);
            } catch (error) {
              console.error(
                `File not found or could not be deleted: ${oldImagePath}`
              );
            }
          }
        }

        res.status(200).json(result);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Video Updation Failed" });
    } finally {
      conn.releaseConnection();
    }
  }
}
