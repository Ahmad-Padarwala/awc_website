// api/category/[id].js

import conn from "../dbconfig/conn";
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
      const q = "SELECT * FROM `user` WHERE id = ?";

      const data = [id];
      const [rows] = await conn.query(q, data);

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
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
        const { email, number, favicon, logo, username, password } = fields;

        let sql = "";
        let params = [];

        // get category data
        const [setting] = await conn.query(
          "SELECT `favicon`, `logo`  FROM `user` WHERE id = ?",
          [id]
        );

        if (!files.favicon && !files.logo) {
          // No new images provided, updating other fields
          sql =
            "UPDATE `user` SET `email`=?, `number`=?, `username`=?, `password`=?  WHERE `id` = ?";

          params = [
            email,
            number,
            username,
            password,
            id,
          ];
        } else {
          // Check and update each image if provided
          const updateImages = async (
            imageField,
            imageFile,
            index,
            fieldName
          ) => {
            if (imageFile) {
              const oldImage = setting[0][fieldName];
              if (oldImage) {
                // Delete old image
                const oldImagePath = path.join(
                  __dirname,
                  "../../../../../public/assets/upload/setting",
                  oldImage
                );
                if (fs.existsSync(oldImagePath)) {
                  await unlink(oldImagePath);
                } else {
                  console.log(`File does not exist: ${oldImagePath}`);
                }
              }

              const oldPath = imageFile[0].filepath;
              const nFileName = `${Date.now()}_${index}.${imageFile[0].originalFilename
                }`;
              const newFileName = nFileName.replace(/\s/g, "");
              const projectDirectory = path.resolve(
                __dirname,
                "../../../../../public/assets/upload/setting"
              );
              const newPath = path.join(projectDirectory, newFileName);

              fs.copyFile(oldPath, newPath, (moveErr) => {
                if (moveErr) {
                  console.log(moveErr);
                  return res
                    .status(500)
                    .json({ message: `File ${index} Upload failed.` });
                }
              });

              return newFileName;
            }
            return imageField;
          };

          // Update images if provided
          let upadateFavicon = favicon;
          let upadateLogo = logo;

          //check! is this image ?
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

          if (files.favicon) {
            const CategoryImgExtension = path
              .extname(files.favicon[0].originalFilename)
              .toLowerCase();
            if (!allowedImageExtensions.includes(CategoryImgExtension)) {
              return res
                .status(400)
                .json({ message: "Only image files are allowed." });
            }
            upadateFavicon = await updateImages(
              favicon,
              files.favicon,
              1,
              "favicon"
            );
          }

          if (files.logo) {
            const CategoryIconExtension = path
              .extname(files.logo[0].originalFilename)
              .toLowerCase();

            if (!allowedImageExtensions.includes(CategoryIconExtension)) {
              return res
                .status(400)
                .json({ message: "Only image files are allowed." });
            }
            upadateLogo = await updateImages(
              logo,
              files.logo,
              2,
              "logo"
            );
          }

          // SQL query for updating the database with new images
          sql =
            "UPDATE `user` SET `email`=?, `number`=?, `favicon`=?, `logo`=?, `username`=?, `password`=?  WHERE `id` = ?";

          params = [
            email,
            number,
            upadateFavicon,
            upadateLogo,
            username,
            password,
            id,
          ];
        }

        const result = await conn.query(sql, params);
        res.status(200).json(result);
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Cannot update Category... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }

}
