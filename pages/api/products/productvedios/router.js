import conn from "../../dbconfig/conn";
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
      const productId = fields.product_id;
      // check file exist or not
      if (!files.vedio_thumbnail) {
        return res.status(400).json({ message: "Please Upload Files." });
      }
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
        console.log("Come");

      // configuration of path and name
      // old path where file availbale
      const oldPath = files.vedio_thumbnail[0].filepath; // Access the path of the uploaded image
      // new path
      const nFileName = `${Date.now()}.${
        files.vedio_thumbnail[0].originalFilename
      }`;
      // remove space
      const newFileName = nFileName.replace(/\s/g, "");
      // project dir
      const projectDirectory = path.resolve(
        __dirname,
        "../../../../../../public/assets/upload/products/productVedios"
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
            const {
              vedio_title,
              vedio_link,
              vedio_description
            } = fields;

            const [row] = await conn.query(
              "INSERT INTO product_video SET ? ",
              {
                product_id : productId,
                product_video:vedio_link,
                video_thumbnail:newFileName,
                video_title:vedio_title,
                video_description:vedio_description,
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
    });
  }
}
