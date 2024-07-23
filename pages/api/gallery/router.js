import util from "util";
import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";

const copyFileAsync = util.promisify(fs.copyFile);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      try {
        const copyPromises = [];

        for (let index = 0; index < files.gallery_images.length; index++) {
          const image = files.gallery_images[index];
          const imageDetails = {
            gallery_title: fields[`gallery_title_${index}`] || "",
            gallery_sort: fields[`gallery_sort_${index}`] || "",
            file: image.originalFilename,
          };

          // Extract category IDs from fields
          const categoryIds = [];
          for (let categoryIndex = 0; ; categoryIndex++) {
            const key = `gallery_categories_${index}_${categoryIndex}`;
            if (!fields[key]) break;
            categoryIds.push(fields[key]);
          }

          // Save a separate copy of the image for each category
          for (const categoryId of categoryIds) {
            const newFileName = `${Date.now()}_${image.originalFilename}`;
            const projectDirectory = path.resolve(
              __dirname,
              "../../../../../public/assets/upload/gallery"
            );
            const newPath = path.join(projectDirectory, newFileName);

            const copyPromise = copyFileAsync(image.filepath, newPath);
            copyPromises.push(copyPromise);

            // Database insertion for each category ID
            const sql =
              "INSERT INTO gallery (gallery_title, gallery_image, gallery_sort, gallery_category_id) VALUES (?, ?, ?, ?)";
            const values = [
              imageDetails.gallery_title,
              newFileName,
              imageDetails.gallery_sort,
              categoryId,
            ];

            await conn.query(sql, values);
          }
        }

        // Wait for all file copies to complete before sending the response
        await Promise.all(copyPromises);

        res.status(200).json({ message: "File Upload successful." });
      } catch (error) {
        res.status(500).json({});
      }
    });
  }

  if (req.method === "GET") {
    try {
      // Query the database
      const getGalleryData = "SELECT * FROM `gallery` ORDER BY id DESC ";

      const [rows] = await conn.query(getGalleryData);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
