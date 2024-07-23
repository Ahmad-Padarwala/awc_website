import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  // Handling GET request for fetching career details
  //   if (req.method === "GET") {
  //     try {
  //       const q = "SELECT * FROM `job_applicaiton` WHERE id = ?";

  //       const data = [id];
  //       const [rows] = await conn.query(q, data);

  //       res.status(200).json(rows);
  //     } catch (error) {
  //       console.log(error);
  //       res
  //         .status(500)
  //         .json({ message: "Can not Get career... check connection" });
  //     } finally {
  //       conn.releaseConnection();
  //     }
  //   }

  // Handling DELETE request for fetching career details
  if (req.method === "DELETE") {
    try {
      // Delete product category data
      const deleteQuery = "DELETE FROM job_application WHERE id = ?";
      const [deleteRows] = await conn.query(deleteQuery, [id]);

      // Send the response
      res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error processing request",
      });
    } finally {
      conn.releaseConnection();
    }
  }

  // Handling PATCH request for fetching career details
  if (req.method === "PATCH") {
    const { role_name, job_desc, category, nop, duration } = req.body;
    try {
      const updateQuery = `
          UPDATE job_application
          SET role_name=?, job_desc=?, category=?, nop=?, duration=?
          WHERE id=?
        `;

      const [row] = await conn.query(updateQuery, [
        role_name,
        job_desc,
        category,
        nop,
        duration,
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
}
