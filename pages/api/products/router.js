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
        cate_id,
        product_title,
        product_short_desc,
        product_long_desc,
        meta_tag,
        meta_desc,
        meta_keyword,
        canonical_url,
      } = fields;

      // check file exist or not
      if (!files.product_image) {
        return res.status(400).json({ message: "Please Upload Files." });
      }

      // Check file existence for product brochure PDF
      if (!files.product_brochure) {
        return res
          .status(400)
          .json({ message: "Please Upload Product Brochure PDF." });
      }
      // check Category exist or not
      if (!cate_id || cate_id == 0) {
        return res.status(400).json({ message: "Please Select Category." });
      }

      //check! is this image ?
      const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const allowedPdfExtensions = [".pdf"];

      const fileExtension = path
        .extname(files.product_image[0].originalFilename)
        .toLowerCase();

      const pdfFileExtension = path
        .extname(files.product_brochure[0].originalFilename)
        .toLowerCase();

      if (!allowedImageExtensions.includes(fileExtension)) {
        return res
          .status(400)
          .json({ message: "Only image files are allowed." });
      }

      // Validate PDF file extension
      if (!allowedPdfExtensions.includes(pdfFileExtension)) {
        return res.status(400).json({
          message: "Only PDF files are allowed for product brochure.",
        });
      }

      // configuration of path and name
      // old path where file availbale
      const oldPath = files.product_image[0].filepath; // Access the path of the uploaded image
      // new path
      const nFileName = `${Date.now()}.${
        files.product_image[0].originalFilename
      }`;
      // remove space
      const newFileName = nFileName.replace(/\s/g, "");
      // project dir

      // Configuration for product brochure PDF path and name...
      const pdfOldPath = files.product_brochure[0].filepath;
      const pdfNFileName = `${Date.now()}_${
        files.product_brochure[0].originalFilename
      }`;
      const pdfnewFileName = pdfNFileName.replace(/\s/g, "");

      const projectDirectory = path.resolve(
        __dirname,
        "../../../../../public/assets/upload/products"
      );
      // combine path and image name
      const pdfNewPath = path.join(projectDirectory, pdfnewFileName);
      const newPath = path.join(projectDirectory, newFileName);

      // copy img from old path to new path
      fs.copyFile(oldPath, newPath, async (moveErr) => {
        if (moveErr) {
          console.log("moveErr");
          res.status(500).json({ message: "File Upload failed." });
        } else {
          fs.copyFile(pdfOldPath, pdfNewPath, async (pdfMoveErr) => {
            if (pdfMoveErr) {
              console.log(pdfMoveErr);
              res.status(500).json({ message: "Product Brochure Upload failed." });
            } else {
              try {
                console.log(fields);
                // db operation
                const [row] = await conn.query(
                  "INSERT INTO product_master SET ? ",
                  {
                    cate_id: cate_id,
                    product_title: product_title,
                    product_short_desc: product_short_desc,
                    product_long_desc: product_long_desc,
                    meta_tag: meta_tag,
                    meta_desc: meta_desc,
                    meta_keyword: meta_keyword,
                    canonical_url: canonical_url,
                    product_image: newFileName,
                    product_brochure: pdfnewFileName,
                    status: 1,
                  }
                );
                res.status(200).json(row);
              } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Failed to Add Product Category" });
              } finally {
                conn.releaseConnection();
              }
            }
          });
        }
      });
    });
  }

  if (req.method == "GET") {
    try {
      // Query the database

      const q = "SELECT * FROM `product_master`";
      console.log(q);
      const [rows] = await conn.query(q);
      console.log(rows);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    } finally {
      conn.releaseConnection();
    }
  }
}
