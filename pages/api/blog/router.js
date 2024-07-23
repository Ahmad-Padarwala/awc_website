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
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      const {
        blog_cate_id,
        blog_title,
        blog_description,
        meta_desc,
        canonical_url,
        meta_tag,
        meta_keyword,
      } = fields;

      // check file exist or not
      if (!files.blog_thumbnail) {
        return res.status(400).json({ message: "Please Upload Files." });
      }

      // check Category exist or not
      if (!blog_cate_id || blog_cate_id == 0) {
        return res.status(400).json({ message: "Please Select Category." });
      }

      //check! is this image ? 
      const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const fileExtension = path.extname(files.blog_thumbnail[0].originalFilename).toLowerCase();
  
      if (!allowedImageExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: 'Only image files are allowed.' });
      }
  

      // configuration of path and name
      // old path where file availbale
      const oldPath = files.blog_thumbnail[0].filepath; // Access the path of the uploaded image
      // new path
      const nFileName = `${Date.now()}.${
        files.blog_thumbnail[0].originalFilename
      }`;
      // remove space
      const newFileName = nFileName.replace(/\s/g, "");
      // project dir
      const projectDirectory = path.resolve(
        __dirname,
        "../../../../../public/assets/upload/blogs"
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
            const [row] = await conn.query(
              "INSERT INTO blog_master SET ? ",
              {
                blog_title: blog_title,
                blog_thumbnail: newFileName,
                blog_description: blog_description,
                meta_tag: meta_tag,
                meta_desc: meta_desc,
                meta_keyword: meta_keyword,
                canonical_url: canonical_url,
                status: 1,
                blog_cate_id: blog_cate_id,
              }
            );
            res.status(200).json(row);
          } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Failed to Add Product Category" });
          }
          finally {
            conn.releaseConnection();
          }
        }
      });
    });
  }

  if (req.method == "GET") {
    try {
      // Query the database

      const q = "SELECT * FROM `blog_master`";
      console.log(q);
      const [rows] = await conn.query(q);
      console.log(rows);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }finally {
      conn.releaseConnection();
    }
  }
}
