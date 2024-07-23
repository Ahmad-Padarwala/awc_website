import conn from "../../dbconfig/conn";

export default async function handler(req, res) {
  if (req.method == "GET") {
    try {
      // Query the database
      const q = `select * from social_links`;

      const [rows] = await conn.query(q);

      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching social links:", error);
      res.status(502).json({ error: "Connection Error" });
    } finally {
      conn.releaseConnection();
    }
  }
}
