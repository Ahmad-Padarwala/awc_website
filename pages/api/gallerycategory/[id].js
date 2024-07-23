// api/category/[id].js

import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `gallery_category` WHERE id = ?";

      const data = [id];
      const [rows] = await conn.query(q, data);

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Can not Get gallery category... check connection" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      // Query for delete category
      const deleteGalleryCategory = "DELETE FROM gallery_category WHERE id = ?";

      const [rows] = await conn.query(deleteGalleryCategory, [id]);

      // Check if any rows were affected
      if (rows.affectedRows === 0) {
        // No rows were affected, which means the record did not exist
        return res.status(404).json({
          message: "Gallery Category not found.",
        });
      }

      // Process the data and send the response
      res
        .status(200)
        .json({ message: "Gallery Category deleted successfully." });
    } catch (error) {
      if (error?.errno === 1451 || error?.code === "ER_ROW_IS_REFERENCED_2") {
        // Foreign key constraint violation
        return res.status(400).json({
          message: "This category has many images. ",
        });
      }

      res.status(500).json({
        message: "Cannot Delete Gallery Category... Check Connection",
        error: error.message,
      });
    }
  }
  if (req.method == "PATCH") {
    try {
      const updateGalleryCategory =
        "UPDATE gallery_category set `category_title`=? WHERE id=?";

      const values = [req.body.category_title, id];

      const result = await conn.query(updateGalleryCategory, values);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Gallery Category Updation Failed" });
    }
  }
}
