// api/category/[id].js

import conn from "../../../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";
const { unlink } = require("fs").promises;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `product_images` WHERE prod_image_id = ?";

      const data = [id];
      const [rows] = await conn.query(q, data);

      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Can not Get category... check connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        // check file exist or not
        const { vedio_title, vedio_description, vedio_link, vedio_thumbnail } =
          fields;

        let sql = "";
        let params = [];
        let result = "";

        if (!files.vedio_thumbnail) {
          sql =
            "UPDATE `product_video` SET `product_video`= ?, `video_title`= ?, `video_description`= ?  WHERE prod_video_id = ?";

          params = [
            vedio_link,
            vedio_title,
            vedio_description,
            id,
          ];
          result = await conn.query(sql, params);
        } else {
          //check! is this image ?
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
          const fileExtension = path
            .extname(files.vedio_thumbnail[0].originalFilename)
            .toLowerCase();

          if (!allowedImageExtensions.includes(fileExtension)) {
            return res
              .status(400)
              .json({ message: "Only image files are allowed." });
          }

          // get Old Image data
          const [productVid] = await conn.query(
            "SELECT video_thumbnail FROM product_video WHERE prod_video_id = ?",
            [id]
          );
          // Configuration for the new image
          const oldPath = files.vedio_thumbnail[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${
            files.vedio_thumbnail[0].originalFilename
          }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../../../public/assets/upload/products/productVedios"
          );
          const newPath = path.join(projectDirectory, newFileName);

          // Copy the new image from the old path to the new path
          fs.copyFile(oldPath, newPath, (moveErr) => {
            if (moveErr) {
              console.log(moveErr);
              return res.status(500).json({ message: "File Uploading failed." });
            }
          });

          sql =
            "UPDATE `product_video` SET `product_video`= ?, `video_thumbnail`= ?, `video_title`= ?, `video_description`= ?  WHERE prod_video_id = ?";

            params = [
              vedio_link,
              newFileName,
              vedio_title,
              vedio_description,
              id,
            ];
          result = await conn.query(sql, params);
          if (productVid.length !== 0) {
            const oldImage = productVid[0].video_thumbnail;
            const oldImagePath = path.join(projectDirectory, oldImage);
            if (fs.existsSync(oldImagePath)) {
              await unlink(oldImagePath);
            } else {
              console.log(`File does not exist: ${oldImagePath}`);
            }
          }
        }

        // Delete the old image
        res.status(200).json(result);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Product Images Updation Failed" });
    } finally {
      conn.releaseConnection();
    }
  }
}
