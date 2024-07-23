import conn from "../../../dbconfig/conn";
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `testimonial` where status = 1";
      const [rows] = await conn.query(q);

      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Can not Get category... check connection" });
    } finally {
      conn.releaseConnection();
    }
  }

}
