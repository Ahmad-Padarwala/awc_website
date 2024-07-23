import conn from "../../dbconfig/conn";

export default async function handler(req, res) {
  // Handling PATCH request for updating testimonial_video status
  if (req.method == "PATCH") {
    try {
      // Extract the array of IDs from the request query
      const { ids } = req.query; // This will contain the array of IDs

      // Destructure the IDs from the array
      const [id, status] = ids;

      // Check the status value and update accordingly
      if (status == 1) {
        // If the status is 1, update the testimonial_video status to 0
        const sql = "UPDATE testimonial_video SET status=0 WHERE id = ?";
        const [rows] = await conn.query(sql, [id]);

        res.status(200).json(rows);
      } else {
        // If the status is not 1, update the testimonial_video status to 1
        const sql = "UPDATE testimonial_video SET status=1 WHERE id = ?";
        const [rows] = await conn.query(sql, [id]);

        res.status(200).json(rows);
      }
    } catch (err) {
      // Handle any errors during the database operation
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
