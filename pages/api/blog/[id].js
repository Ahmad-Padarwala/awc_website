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
      const q = "SELECT * FROM `blog_master` WHERE blog_id = ?";

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

      const [blog] = await conn.query(
        "SELECT blog_thumbnail FROM blog_master WHERE blog_id = ?",
        [id]
      );

      // Query the database
      const q = "DELETE FROM blog_master WHERE blog_id = ?";

      const [rows] = await conn.query(q, [id]);

      let blogThumbnail = "";
      if (blog.length !== 0) {
        blogThumbnail = blog[0].blog_thumbnail;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/blogs"
        );
        const newPath = path.join(projectDirectory, blogThumbnail);

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
        // check file exist or not
        const {
          blog_cate_id,
          blog_title,
          blog_description,
          meta_tag,
          meta_desc,
          meta_keyword,
          canonical_url,
        } = fields;


        const [blog] = await conn.query(
          "SELECT blog_thumbnail FROM blog_master WHERE blog_id = ?",
          [id]
        );

        let sql = "";
        let params = [];
        let result = "";

        const upadatedDate = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        if (!files.blog_thumbnail) {
          sql =
            "UPDATE `blog_master` SET `blog_title`= ?,  `blog_description`= ?, `meta_tag`= ?, `meta_desc`= ?, `meta_keyword`= ?, `canonical_url`= ?, `updated_date`= ?, `blog_cate_id`= ?  WHERE blog_id = ?";

          params = [
            blog_title,
            blog_description,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            upadatedDate,
            blog_cate_id,
            id,
          ];
          result = await conn.query(sql, params);
        } else {
          //check! is this image ?
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
          const fileExtension = path
            .extname(files.blog_thumbnail[0].originalFilename)
            .toLowerCase();

          if (!allowedImageExtensions.includes(fileExtension)) {
            return res
              .status(400)
              .json({ message: "Only image files are allowed." });
          }
          const oldPath = files.blog_thumbnail[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${files.blog_thumbnail[0].originalFilename
            }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../public/assets/upload/blogs"
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
            "UPDATE `blog_master` SET `blog_title`= ?, `blog_thumbnail`= ?, `blog_description`= ?, `meta_tag`= ?, `meta_desc`= ?, `meta_keyword`= ?, `canonical_url`= ?, `updated_date`= ?, `blog_cate_id`= ?  WHERE blog_id = ?";

          params = [
            blog_title,
            newFileName,
            blog_description,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            upadatedDate,
            blog_cate_id,
            id,
          ];
          result = await conn.query(sql, params);

          if (blog.length !== 0) {
            const oldImage = blog[0].blog_thumbnail;
            const oldImagePath = path.join(projectDirectory, oldImage);
            if (fs.existsSync(oldImagePath)) {
              await unlink(oldImagePath);
            } else {
              console.log(`File does not exist: ${oldImagePath}`);
            }
          }
        }

        res.status(200).json(result);
      });
    } catch (err) {
      res.status(500).json({ message: "Category Updation Failed" });
    } finally {
      conn.releaseConnection();
    }
  }
}
