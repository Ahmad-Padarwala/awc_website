import conn from "../../../dbconfig/conn";

export const config = {
  api: {
    bodyParser: false,
  }, 
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter
  if (req.method == "GET") {

    try {

      const q = "SELECT * FROM `blog_master` where `blog_cate_id` = ? AND `status` = 1 LIMIT 3"
      
      const data = [id];
      const [rows] = await conn.query(q, data);
      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Can not Get gallery... check connection" });
    }
  }

}
