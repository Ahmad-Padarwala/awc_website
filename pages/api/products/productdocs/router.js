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
      for (let index = 0; index < files.product_docs.length; index++) {
        const docs = files.product_docs[index];
        const docsDetails = {
          docs_title: fields[`docs_title_${index}`] || "",
          file: docs.originalFilename,
        };

        console.log(docsDetails);
        // File saving
        const oldPath = docs.filepath;
        const newFileName = `${Date.now()}_${docs.originalFilename}`;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/products/productDocs"
        );
        const newPath = path.join(projectDirectory, newFileName);

        fs.copyFile(oldPath, newPath, async (moveErr) => {
          if (moveErr) {
            console.log(moveErr);
            res.status(500).json({ message: "File Upload failed." });
          } else {
            // Database insertion
            const sql =
              "INSERT INTO `product_docs`(`product_id`, `pdf_title`, `pdf_link`) VALUES (?, ?, ?)";
            const values = [
              productId,
              docsDetails.docs_title,
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
