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
      const q = "SELECT * FROM `blog_category` WHERE blog_cate_id = ?";

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

  if (req.method == "DELETE") {
    try {
      const { id } = req.query;

      // get category data
      const [category] = await conn.query(
        "SELECT category_image, category_icon FROM blog_category WHERE blog_cate_id = ?",
        [id]
      );

      // Query for delete category
      const q = "DELETE FROM blog_category WHERE blog_cate_id = ?";
      console.log(id)
      const [rows] = await conn.query(q, [id]);

      // check image awailable or not
      if (category.length !== 0) {
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/blog"
        );

        // Delete categoryImage
        const categoryImage = category[0].category_image;
        if (categoryImage) {
          const imagePath = path.join(projectDirectory, categoryImage);

          // Check if the file exists before unlinking
          if (fs.existsSync(imagePath)) {
            await unlink(imagePath);
          } else {
            console.log(`File does not exist: ${imagePath}`);
          }
        }

        // Delete categoryIcon
        const categoryIcon = category[0].category_icon;
        if (categoryIcon) {
          const iconPath = path.join(projectDirectory, categoryIcon);

          // Check if the file exists before unlinking
          if (fs.existsSync(iconPath)) {
            await unlink(iconPath);
          } else {
            console.log(`File does not exist: ${iconPath}`);
          }
        }

      }

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Cannot Delete Category... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const {
          category_title,
          category_description,
          meta_tag,
          meta_desc,
          meta_keyword,
          canonical_url,
          category_image,
          category_icon,
        } = fields;
        console.log(fields);

        let sql = "";
        let params = [];

        // get category data
        const [category] = await conn.query(
          "SELECT category_image, category_icon FROM blog_category WHERE blog_cate_id = ?",
          [id]
        );

        if (!files.category_icon && !files.category_image) {
          // No new images provided, updating other fields
          sql =
            "UPDATE `blog_category` SET `category_title`= ?, `category_description`= ?, `meta_tag`= ?, `meta_description`= ?, `meta_keyword`= ?, `canonical_url`= ?, `category_image`= ?, `category_icon`= ?  WHERE blog_cate_id = ?";

          params = [
            category_title,
            category_description,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            category_image,
            category_icon,
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
              const oldImage = category[0][fieldName];
              if (oldImage) {
                // Delete old image
                const oldImagePath = path.join(
                  __dirname,
                  "../../../../../public/assets/upload/blog",
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
                "../../../../../public/assets/upload/blog"
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
          let updatedimage = category_image;
          let updatedicon = category_icon;

          //check! is this image ?
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

          if (files.category_image) {
            const CategoryImgExtension = path
              .extname(files.category_image[0].originalFilename)
              .toLowerCase();
            if (!allowedImageExtensions.includes(CategoryImgExtension)) {
              return res
                .status(400)
                .json({ message: "Only image files are allowed." });
            }
            updatedimage = await updateImages(
              category_image,
              files.category_image,
              1,
              "category_image"
            );
          }

          if (files.category_icon) {
            const CategoryIconExtension = path
              .extname(files.category_icon[0].originalFilename)
              .toLowerCase();

            if (!allowedImageExtensions.includes(CategoryIconExtension)
            ) {
              return res
                .status(400)
                .json({ message: "Only image files are allowed." });
            }
            updatedicon = await updateImages(
              category_icon,
              files.category_icon,
              2,
              "category_icon"
            );
          }

          // SQL query for updating the database with new images
          sql =
            "UPDATE `blog_category` SET `category_title`= ?, `category_description`= ?, `meta_tag`= ?, `meta_description`= ?, `meta_keyword`= ?, `canonical_url`= ?, `category_image`= ?, `category_icon`= ?  WHERE blog_cate_id = ?";

          params = [
            category_title,
            category_description,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            updatedimage,
            updatedicon,
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
