import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  // Handling GET request for fetching contact details
  if (req.method == "GET") {
    try {
      // Query the database to fetch all contact details
      const fetchQuery = "SELECT * FROM `contact_form` ORDER BY id DESC";

      // Execute the query
      const [rows] = await conn.query(fetchQuery);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
