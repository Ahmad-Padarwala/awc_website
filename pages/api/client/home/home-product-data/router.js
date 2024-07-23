import conn from "../../../dbconfig/conn";

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
        "SELECT pc.`category_id`, pc.`category_name`, pc.`category_title`, pc.`category_image`, pm.`product_id`, pm.`product_title` FROM `product_category` pc INNER JOIN `product_master` pm ON pc.`category_id` = pm.`cate_id` WHERE pc.`status` = 1 AND pm.`status` = 1 ORDER BY pc.`category_id`, pm.`product_id` LIMIT 9";
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
