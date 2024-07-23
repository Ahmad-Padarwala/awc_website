import conn from "../../dbconfig/conn";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method == "GET") {
    try {
      // Query the database

      const q =
        "SELECT product_id FROM product_master ORDER BY product_id DESC LIMIT 1";
      console.log(q);
      const [rows] = await conn.query(q);
      console.log(rows);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    } finally {
      conn.releaseConnection();
    }
  }
}
