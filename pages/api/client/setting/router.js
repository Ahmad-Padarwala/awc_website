import conn from "../../dbconfig/conn";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { username, password } = req.body;

    try {
      // Query the database
      const q = `select * from user`;

      const [rows] = await conn.query(q);

      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(502).json({ error: "Connection Error" });
    } finally {
      conn.releaseConnection();
    }
  }
}
