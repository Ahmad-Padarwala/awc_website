import { checkApiAuth } from "@/pages/api/authmiddleware";
import conn from "../../../dbconfig/conn";


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
      // Query the database

      const q =
        "SELECT * FROM `job_application`";
      const [rows] = await conn.query(q);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    } finally {
      conn.releaseConnection();
    }
  }
}
