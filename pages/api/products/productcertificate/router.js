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
      for (let index = 0; index < files.product_certificate.length; index++) {
        const certificate = files.product_certificate[index];
        const docsDetails = {
          certificate_title: fields[`certificate_title_${index}`] || "",
          file: certificate.originalFilename,
        };

        console.log(docsDetails);
        // File saving
        const oldPath = certificate.filepath;
        const newFileName = `${Date.now()}_${certificate.originalFilename}`;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/products/productCertificate"
        );
        const newPath = path.join(projectDirectory, newFileName);

        fs.copyFile(oldPath, newPath, async (moveErr) => {
          if (moveErr) {
            console.log(moveErr);
            res.status(500).json({ message: "File Upload failed." });
          } else {
            // Database insertion
            const sql =
              "INSERT INTO `product_certificate`(`prod_id`, `certificate_title`, `certificate_link`) VALUES (?, ?, ?)";
            const values = [
              productId,
              docsDetails.certificate_title,
              newFileName
            ];

            const result = await conn.query(sql, values);
            res.status(200).json(result)
          }
        });
      }
    });
  }
}
