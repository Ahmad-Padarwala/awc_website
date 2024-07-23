import conn from "../../dbconfig/conn";
import path from "path";
import fs from "fs";
import { IncomingForm } from "formidable";
const { unlink } = require("fs").promises;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Handling DELETE request for deleting certificates
  const { id } = req.query;
  if (req.method === "DELETE") {
    try {
      // Get certificate data
      const [certificate] = await conn.query(
        "SELECT pdf, thumbnail FROM about_certificate WHERE id = ?",
        [id]
      );

      // Query for deleting certificate
      const deleteQuery = "DELETE FROM about_certificate WHERE id = ?";
      const [deleteResult] = await conn.query(deleteQuery, [id]);

      // Check files availability
      if (certificate.length !== 0) {
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/about/certificates"
        );

        // Delete PDF file
        const pdfFile = certificate[0].pdf;
        if (pdfFile) {
          const pdfPath = path.join(projectDirectory, pdfFile);

          try {
            await fs.access(pdfPath);
            await fs.unlink(pdfPath);
          } catch (error) {
            console.error(`File not found or could not be deleted: ${pdfPath}`);
          }
          // Check if the file exists before unlinking
        }

        // Delete Thumbnail file
        const thumbnailFile = certificate[0].thumbnail;
        if (thumbnailFile) {
          const thumbnailPath = path.join(projectDirectory, thumbnailFile);

          try {
            await fs.access(thumbnailPath);
            console.log(`Deleting file: ${thumbnailPath}`);
            await fs.unlink(thumbnailPath);
          } catch (error) {
            console.error(
              `File not found or could not be deleted: ${thumbnailPath}`
            );
          }
        }
      }

      // Send the response
      res.status(200).json(deleteResult);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Cannot Delete Certificate... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }
  if (req.method === "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        console.log(fields);
        const { title, pdf, thumbnail } = fields; // Assuming you have an 'id' field in the form

        let sql = "";
        let params = [];

        // get certificate data
        const [certificate] = await conn.query(
          "SELECT pdf, thumbnail FROM about_certificate WHERE id = ?",
          [id]
        );
        if (!files.pdf && !files.thumbnail) {
          // No new files provided, updating other fields
          sql =
            "UPDATE `about_certificate` SET `title`= ?, `status`= ? WHERE id = ?";

          params = [title, 1, id];
        } else {
          // Check and update each file if provided
          const updateFiles = async (fileField, file, index, fieldName) => {
            if (file) {
              const oldFile = certificate[0][fieldName];
              if (oldFile) {
                // Delete old file
                const oldFilePath = path.join(
                  __dirname,
                  "../../../../../../public/assets/upload/about/certificates",
                  oldFile
                );
                try {
                  await fs.access(oldFilePath);
                  console.log(`Deleting file: ${oldFilePath}`);
                  await fs.unlink(oldFilePath);
                } catch (error) {
                  console.error(
                    `File not found or could not be deleted: ${oldFilePath}`
                  );
                }
              }

              const oldPath = file[0].filepath;
              const newFileName = `${Date.now()}_${index}.${
                file[0].originalFilename
              }`;
              const newFileNameWithoutSpaces = newFileName.replace(/\s/g, "");
              const projectDirectory = path.resolve(
                __dirname,
                "../../../../../../public/assets/upload/about/certificates"
              );
              const newPath = path.join(
                projectDirectory,
                newFileNameWithoutSpaces
              );

              fs.copyFile(oldPath, newPath, (copyErr) => {
                if (copyErr) {
                  console.error(copyErr);
                  return res
                    .status(500)
                    .json({ message: `File ${index} Upload failed.` });
                }
              });

              return newFileNameWithoutSpaces;
            }
            return fileField;
          };

          // Update files if provided
          let updatedPdf = certificate[0].pdf;
          let updatedThumbnail = certificate[0].thumbnail;

          if (files.pdf) {
            updatedPdf = await updateFiles(
              certificate[0].pdf,
              files.pdf,
              1,
              "pdf"
            );
          }

          if (files.thumbnail) {
            updatedThumbnail = await updateFiles(
              certificate[0].thumbnail,
              files.thumbnail,
              2,
              "thumbnail"
            );
          }

          // SQL query for updating the database with new files
          sql =
            "UPDATE `about_certificate` SET `title`= ?, `pdf`= ?, `thumbnail`= ?, `status`= ? WHERE id = ?";

          params = [title, updatedPdf, updatedThumbnail, 1, id];
        }
        const result = await conn.query(sql, params);
        console.log(result);
        res.status(200).json(result);
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Cannot update Certificate... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }
}
