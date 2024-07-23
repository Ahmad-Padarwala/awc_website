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
  // Handling POST request for adding a testimonial
  if (req.method == "POST") {
    try {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        // check if the image file exists
        if (!files.testimonial_image) {
          return res.status(400).json({ message: "Please Upload Files." });
        }

        // configuration of path and name for the image
        const oldPathImage = files.testimonial_image[0].filepath; // Access the path of the uploaded image

        // new path and name for the image
        const nFileNameImage = `${Date.now()}.${
          files.testimonial_image[0].originalFilename
        }`;

        // remove spaces from the image name
        const newFileNameImage = nFileNameImage.replace(/\s/g, "");

        // project directory for storing images
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/testimonial"
        );

        // combine path and image name
        const newPathImage = path.join(projectDirectory, newFileNameImage);

        // Copy the uploaded image to the new path
        fs.copyFile(oldPathImage, newPathImage, async (moveErr1) => {
          if (moveErr1) {
            res.status(500).json({ message: "File Upload failed." });
          } else {
            // Extracting fields from the request
            const {
              testimonial_title,
              testimonial_desc,
              testimonial_image,
              testimonial_video,
              testimonial_rating,
              product_id,
            } = fields;

            // SQL query for inserting data into the testimonial table
            const insertQuery =
              "INSERT INTO `testimonial`(`testimonial_title`, `testimonial_desc`, `testimonial_image`, `testimonial_video`, `rating`, `product_id`) VALUES (?, ?, ?, ?, ?, ?)";
            const values = [
              testimonial_title,
              testimonial_desc,
              newFileNameImage,
              testimonial_video,
              testimonial_rating,
              product_id,
            ];

            // Execute the query
            const [result] = await conn.query(insertQuery, values);
            res.status(200).json(result, {
              message: "Testimonial Add Successfully",
            });
          }
        });
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Testimonial Failed to Add... Check connection" });
    }
  }

  // Handling GET request for fetching testimonials
  if (req.method == "GET") {
    try {
      // Query the database to fetch all testimonials
      const fetchQuery = "SELECT * FROM `testimonial` ORDER BY id DESC";

      // Execute the query
      const [rows] = await conn.query(fetchQuery);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
