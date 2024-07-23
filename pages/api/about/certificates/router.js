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
  // Handling GET request for fetching contact details
  if (req.method == "POST") {
    try {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {

        // configuration of path and name
        // old path where file availbale
        const oldPaththumbnail = files.thumbnail[0].filepath; // Access the path of the uploaded image
        const oldPathpdf = files.pdf[0].filepath; // Access the path of the uploaded image

        // new path
        const nFileNamethumbnail = `${Date.now()}.${files.thumbnail[0].originalFilename
          }`;
        const nFileNamepdf = `${Date.now()}.${files.pdf[0].originalFilename
          }`;
        // remove space
        const newFileNamepdf = nFileNamepdf.replace(/\s/g, "");
        const newFileNamethumbnail = nFileNamethumbnail.replace(/\s/g, "");

        // project dir
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/about/certificates"
        );
        // combine path and image name
        const newPathpdf = path.join(projectDirectory, newFileNamepdf);
        const newPaththumbnail = path.join(projectDirectory, newFileNamethumbnail);

        fs.copyFile(oldPaththumbnail, newPaththumbnail, async (moveErr1) => {
          if (moveErr1) {
            console.log(moveErr1);
            res.status(500).json({ message: "Thumbnail Upload failed." });
          } else {
            fs.copyFile(oldPathpdf, newPathpdf, async (moveErr2) => {
              if (moveErr2) {
                res.status(500).json({ message: "PDF Upload failed." });
              } else {
                const {
                  title
                } = fields;

                const sql =
                  "INSERT INTO `about_certificate`(`title`, `pdf`, `thumbnail`, `status`) VALUES (?, ?, ?, ?)";
                const values = [
                  title,
                  newFileNamepdf,
                  newFileNamethumbnail,
                  1
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
      // Query the database to fetch all contact details
      const fetchQuery = "SELECT * FROM `about_certificate` ORDER BY id DESC";

      // Execute the query
      const [rows] = await conn.query(fetchQuery);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }


}
