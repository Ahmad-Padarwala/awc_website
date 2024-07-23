import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";
import { unlink, copyFile } from "fs/promises"; // Import copyFile function

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter
  if (req.method == "GET") {
    try {
      const q = "SELECT * FROM `gallery` WHERE gallery_category_id = ?";

      const data = [id];
      const [rows] = await conn.query(q, data);

      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Can not Get gallery... check connection" });
    }
  }

  // only one data delete
  if (req.method == "DELETE") {
    try {
      // get gallery per data
      const [gallery] = await conn.query(
        "SELECT gallery_image FROM gallery WHERE id = ?",
        [id]
      );

      // Query for delete category
      const deleteGalleryData = "DELETE FROM gallery WHERE id = ?";

      const [rows] = await conn.query(deleteGalleryData, [id]);

      // check image awailable or not
      if (gallery.length !== 0) {
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/gallery"
        );

        // Delete galleryImage
        const galleryImage = gallery[0].gallery_image;
        if (galleryImage) {
          const imagePath = path.join(projectDirectory, galleryImage);
          if (fs.existsSync(imagePath)) {
            await unlink(imagePath);
          } else {
            console.log(`File does not exist: ${imagePath}`);
          }
        }
      }

      // Process the data and send the response
      res.status(200).json({ message: "Image deleted successfully." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Cannot Delete Gallery Image... Check Connection" });
    }
  }

  // category wise multiple data delete
  if (req.method == "DELETE") {
    try {
      // get gallery all data
      const [galleryItems] = await conn.query(
        "SELECT id, gallery_image FROM gallery WHERE gallery_category_id = ?",
        [id]
      );

      // Delete each gallery item and its corresponding image
      for (const { id, gallery_image } of galleryItems) {
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/gallery"
        );
        const imagePath = path.join(projectDirectory, gallery_image);

        // Delete gallery image file
        if (fs.existsSync(imagePath)) {
          await unlink(imagePath);
        } else {
          console.log(`File does not exist: ${imagePath}`);
        }

        // Delete the gallery item from the database
        await conn.query("DELETE FROM gallery WHERE id = ?", [id]);
      }

      // Process the data and send the response
      res.status(200).json({ message: "All Items deleted successfully." });
    } catch (error) {
      console.error("Error deleting items:", error);
      res
        .status(500)
        .json({ message: "Error deleting items in the category." });
    }
  }

  // PATCH request to update a single item
  if (req.method == "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const { gallery_title, gallery_image, gallery_sort, gallery_category } =
          fields;

        let sql = "";
        let params = [];
        let result = "";

        // get gallery per data
        const [gallery] = await conn.query(
          "SELECT gallery_image FROM gallery WHERE id = ?",
          [id]
        );

        if (!files.gallery_image) {
          sql =
            "UPDATE `gallery` SET `gallery_title`= ?, `gallery_image`= ?, `gallery_sort`= ?, `gallery_category_id`= ? WHERE id = ?";

          params = [
            gallery_title,
            gallery_image,
            gallery_sort,
            gallery_category,
            id,
          ];

          result = await conn.query(sql, params);
        } else {
          // Configuration for the new image
          const oldPath = files.gallery_image[0].filepath; // Old path of the uploaded image
          const nFileName = `${Date.now()}.${
            files.gallery_image[0].originalFilename
          }`;
          const newFileName = nFileName.replace(/\s/g, "");
          const projectDirectory = path.resolve(
            __dirname,
            "../../../../../public/assets/upload/gallery"
          );
          const newPath = path.join(projectDirectory, newFileName);

          // Use await to ensure that copyFile is completed before moving on
          await copyFile(oldPath, newPath);

          sql =
            "UPDATE `gallery` SET `gallery_title`= ?, `gallery_image`= ?, `gallery_sort`= ?, `gallery_category_id`= ? WHERE id = ?";

          params = [
            gallery_title,
            newFileName,
            gallery_sort,
            gallery_category,
            id,
          ];
          result = await conn.query(sql, params);

          if (gallery.length !== 0) {
            const oldImage = gallery[0].gallery_image;
            const oldImagePath = path.join(projectDirectory, oldImage);

            // Use await to ensure that unlink is completed before moving on
            if (fs.existsSync(oldImagePath)) {
              await unlink(oldImagePath);
            } else {
              console.log(`File does not exist: ${oldImagePath}`);
            }
          }
        }

        // Delete the old image
        res.status(200).json(result);
      });
    } catch (err) {
      res.status(500).json({ message: "Gallery Per Image Updation Failed" });
    }
  }

  // PATCH request to update all items in the category
  if (req.method === "PATCH" && req.query.action === "updateCategory") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const { gallery_title, gallery_image, gallery_sort, gallery_category } =
          fields;

        // Update all items in the category
        const updateRequests = await Promise.all(
          gallery_category.map(async (categoryId) => {
            const updatedFormData = new FormData();
            updatedFormData.append("gallery_title", gallery_title);
            updatedFormData.append("gallery_category", categoryId);
            updatedFormData.append("gallery_sort", gallery_sort);

            // Append the new image if it's selected
            const selectedImage = gallery_image;
            if (selectedImage) {
              updatedFormData.append("gallery_image", selectedImage);
            }

            const res = await axios.patch(
              `${process.env.NEXT_PUBLIC_API_URL}/gallery/${categoryId}`,
              updatedFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            return res.data;
          })
        );

        res
          .status(200)
          .json({ message: "Gallery Items Updated Successfully." });
      });
    } catch (error) {
      console.error("Error updating items:", error);
      res
        .status(500)
        .json({ message: "Error updating items in the category." });
    }
  }
}
