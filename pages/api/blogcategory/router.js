import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        // check file exist or not
        if (!files.category_image) {
          return res
            .status(400)
            .json({ message: "Please Upload Category Image." });
        }

        if (!files.category_icon) {
          return res
            .status(400)
            .json({ message: "Please Upload Category Icon." });
        }
        //check! is this image ?
        const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        const CategoryImgExtension = path
          .extname(files.category_image[0].originalFilename)
          .toLowerCase();
        const CategoryIconExtension = path
          .extname(files.category_icon[0].originalFilename)
          .toLowerCase();

        if (
          !allowedImageExtensions.includes(CategoryImgExtension) ||
          !allowedImageExtensions.includes(CategoryIconExtension)
        ) {
          return res
            .status(400)
            .json({ message: "Only image files are allowed." });
        }

        // configuration of path and name
        // old path where file availbale
        const oldPathimage = files.category_image[0].filepath; // Access the path of the uploaded image
        const oldPathicon = files.category_icon[0].filepath; // Access the path of the uploaded image

        // new path
        const nFileNameimage = `${Date.now()}.${files.category_image[0].originalFilename
          }`;
        const nFileNameicon = `${Date.now()}.${files.category_icon[0].originalFilename
          }`;
        // remove space
        const newFileNameicon = nFileNameicon.replace(/\s/g, "");
        const newFileNameimage = nFileNameimage.replace(/\s/g, "");

        // project dir
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/blog"
        );
        // combine path and image name
        const newPathicon = path.join(projectDirectory, newFileNameicon);
        const newPathimage = path.join(projectDirectory, newFileNameimage);

        fs.copyFile(oldPathimage, newPathimage, async (moveErr1) => {
          if (moveErr1) {
            res.status(500).json({ message: "File Upload failed." });
          } else {
            fs.copyFile(oldPathicon, newPathicon, async (moveErr2) => {
              if (moveErr2) {
                res.status(500).json({ message: "File Upload failed." });
              } else {
                const {
                  category_title,
                  category_description,
                  meta_tag,
                  meta_description,
                  meta_keyword,
                  canonical_url,
                } = fields;

                const sql =
                  "INSERT INTO `blog_category`(`category_title`, `category_description`, `meta_tag`, `meta_description`, `meta_keyword`, `canonical_url`, `category_image`, `category_icon`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const values = [
                  category_title,
                  category_description,
                  meta_tag,
                  meta_description,
                  meta_keyword,
                  canonical_url,
                  newFileNameimage,
                  newFileNameicon,
                  1,
                ];
                const [result] = await conn.query(sql, values);
                res.status(200).json(result);
              }
            });
          }
        });
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Category Failed to Add... Check connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "GET") {
    try {
      // Query the database

      const q = "SELECT * FROM `blog_category`";

      const [rows] = await conn.query(q);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    } finally {
      conn.releaseConnection();
    }
  }
}
