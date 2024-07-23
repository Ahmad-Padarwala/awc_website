import conn from "../dbconfig/conn";


export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  // Handling GET request for fetching a specific testimonial
  if (req.method === "GET") {
    try {
      const getPerTestimonialDataQuery =
        "SELECT * FROM testimonial_video WHERE id = ?";

      const data = [id];
      const [rows] = await conn.query(getPerTestimonialDataQuery, data);

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Can not Get Testimonial Per Data... check connection",
      });
    }
  }

  // Handling PUT request for updating a testimonial
  if (req.method === "PATCH") {
    console.log(req.body)
    const { testimonial_title, testimonial_video, product_id } = req.body;
    try {
      const updateQuery = ` UPDATE testimonial_video SET title=?, link=?, product_id=? WHERE id=?`;

      const [row] = await conn.query(updateQuery, [
        testimonial_title,
        testimonial_video,
        product_id,
        id,
      ]);

      res.status(200).json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update career job" });
    } finally {
      conn.releaseConnection();
    }
  }

  // Handling DELETE request for deleting a testimonial
  if (req.method === "DELETE") {
    try {
      // Query for delete data
      const q = "DELETE FROM testimonial_video WHERE id = ?";

      const [rows] = await conn.query(q, [id]);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Cannot Delete Testimonial... Check Connection" });
    }
  }
}
