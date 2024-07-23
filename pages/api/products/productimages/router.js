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
      console.log(fields.product_id);
      for (let index = 0; index < files.product_images.length; index++) {
        const image = files.product_images[index];
        const imageDetails = {
          image_title: fields[`image_title_${index}`] || "",
          sort_image: fields[`sort_image_${index}`] || "",
          image_width: fields[`image_width_${index}`] || "",
          image_height: fields[`image_height_${index}`] || "",
          alternative: fields[`alternative_${index}`] || "",
          file: image.originalFilename,
        };

        console.log(imageDetails);
        // File saving
        const oldPath = image.filepath;
        const newFileName = `${Date.now()}_${image.originalFilename}`;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/products/productImages"
        );
        const newPath = path.join(projectDirectory, newFileName);

        fs.copyFile(oldPath, newPath, async (moveErr) => {
          if (moveErr) {
            console.log(moveErr);
            res.status(500).json({ message: "File Upload failed." });
          } else {
            // Database insertion
            const sql =
              "INSERT INTO product_images (product_id, image_title, product_image, sort_image, image_width, image_height, alternative) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [
              productId,
              imageDetails.image_title,
              newFileName,
              imageDetails.sort_image,
              imageDetails.image_width,
              imageDetails.image_height,
              imageDetails.alternative,
            ];

            const result = await conn.query(sql, values);
            res.status(200).json(result)
          }
        });
      }
    });
  }
}
