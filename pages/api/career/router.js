import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  // Handling POST request for adding career details
  if (req.method === "POST") {
    const { role_name, job_desc, category, nop, duration } = req.body;
    try {
      const row = await conn.query("INSERT INTO job_application SET ? ", {
        role_name: role_name,
        job_desc: job_desc,
        category: category,
        nop: nop,
        duration: duration,
      });
      res.status(200).json(row);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to Add Career Job" });
    } finally {
      conn.releaseConnection();
    }
  }

  // Handling GET request for fetching contact details
  if (req.method === "GET") {
    try {
      // Query the database to fetch all contact details
      const fetchQuery = "SELECT * FROM `job_application` ORDER BY id DESC";

      // Execute the query
      const [rows] = await conn.query(fetchQuery);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
