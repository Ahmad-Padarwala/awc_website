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
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `gallery` WHERE  gallery_category_id = ?";
      const data = [id];
      const [rows] = await conn.query(q, data);

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
