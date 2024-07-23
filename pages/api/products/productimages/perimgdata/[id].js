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
        const {
          product_image,
          alternative,
          image_height,
          image_title,
          image_width,
          sort_image,
        } = fields;

        let sql = "";
        let params = [];
        let result = "";

        if (!files.product_image) {
          sql =
            "UPDATE `product_images` SET `image_title`= ?, `sort_image`= ?, `image_width`= ?, `image_height`= ?, `alternative`= ? WHERE prod_image_id = ?";

          params = [
            image_title,
            sort_image,
            image_width,
            image_height,
            alternative,
            id,
          ];
          result = await conn.query(sql, params);
        } else {
          //check! is this image ?
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
          const fileExtension = path
            .extname(files.product_image[0].originalFilename)
            .toLowerCase();

          if (!allowedImageExtensions.includes(fileExtension)) {
            return res
              .status(400)
              .json({ message: "Only image files are allowed." });
          }

          // get Old Image data
          const [productImg] = await conn.query(
            "SELECT product_image FROM product_images WHERE prod_image_id = ?",
            [id]
          );
          // Configuration for the new image
          const oldPath = files.product_image[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${
            files.product_image[0].originalFilename
          }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../../../public/assets/upload/products/productImages"
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
            "UPDATE `product_images` SET `image_title`= ?, `product_image`= ?, `sort_image`= ?, `image_width`= ?, `image_height`= ?, `alternative`= ? WHERE prod_image_id = ?";

          params = [
            image_title,
            newFileName,
            sort_image,
            image_width,
            image_height,
            alternative,
            id,
          ];
          result = await conn.query(sql, params);
          if (productImg.length !== 0) {
            const oldImage = productImg[0].product_image;
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
