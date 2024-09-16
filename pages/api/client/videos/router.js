import { checkApiAuth } from "../../authmiddleware";
import conn from "../../dbconfig/conn";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const isAuthenticated = checkApiAuth(req, res);
  if (!isAuthenticated) return;
  if (req.method == "GET") {
    try {
      // Query the database to fetch all contact details
      const fetchQuery = "SELECT * FROM `yt_video` WHERE status = 1";
      // Execute the query
      const [rows] = await conn.query(fetchQuery);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
