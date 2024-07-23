// api/category/[id].js

import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";
const { unlink } = require("fs").promises; // Import the unlink method from fs.promises

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `product_category` WHERE category_id = ?";

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

  if (req.method == "DELETE") {
    try {
      const { id } = req.query;

      // get category data
      const [category] = await conn.query(
        "SELECT category_image FROM product_category WHERE category_id = ?",
        [id]
      );

      // delete product category data
      const q = "DELETE FROM product_category WHERE category_id = ?";

      const [rows] = await conn.query(q, [id]);

      // check image awailable or not
      let categoryImage = "";
      if (category.length != 0) {
        categoryImage = category[0].category_image;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/product-category"
        );
        const newPath = path.join(projectDirectory, categoryImage);
        if (fs.existsSync(newPath)) {
          await unlink(newPath);
        } else {
          console.log(`File does not exist: ${newPath}`);
        }

      }

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Cannot delete this Category because it`s used by admin!",
      });
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
          category_name,
          category_title,
          meta_description,
          canonical_url,
          category_description,
          category_image,
          sub_category,
          meta_tag,
          meta_keyword,
        } = fields;

        let sql = "";
        let params = [];
        let result = "";

        // get category data
        const [category] = await conn.query(
          "SELECT category_image FROM product_category WHERE category_id = ?",
          [id]
        );

        if (!files.category_image) {
          sql =
            "UPDATE `product_category` SET `category_name`= ?, `category_title`= ?, `category_description`= ?, `meta_tag`= ?, `meta_description`= ?, `meta_keyword`= ?, `canonical_url`= ?, `category_image`= ?, `sub_category`= ?  WHERE category_id = ?";

          params = [
            category_name,
            category_title,
            category_description,
            meta_tag,
            meta_description,
            meta_keyword,
            canonical_url,
            category_image,
            sub_category,
            id,
          ];
          result = await conn.query(sql, params);
        } else {
          //check! is this image ?
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
          const fileExtension = path
            .extname(files.category_image[0].originalFilename)
            .toLowerCase();

          if (!allowedImageExtensions.includes(fileExtension)) {
            return res
              .status(400)
              .json({ message: "Only image files are allowed." });
          }

          // Configuration for the new image
          const oldPath = files.category_image[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${
            files.category_image[0].originalFilename
          }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../public/assets/upload/product-category"
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
            "UPDATE `product_category` SET `category_name`= ?, `category_title`= ?, `category_description`= ?, `meta_tag`= ?, `meta_description`= ?, `meta_keyword`= ?, `canonical_url`= ?, `category_image`= ?, `sub_category`= ?  WHERE category_id = ?";

          params = [
            category_name,
            category_title,
            category_description,
            meta_tag,
            meta_description,
            meta_keyword,
            canonical_url,
            newFileName,
            sub_category,
            id,
          ];
          result = await conn.query(sql, params);
          if (category.length !== 0) {
            const oldImage = category[0].category_image;
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
      res.status(500).json({ message: "Category Updation Failed" });
    } finally {
      conn.releaseConnection();
    }
  }
}
