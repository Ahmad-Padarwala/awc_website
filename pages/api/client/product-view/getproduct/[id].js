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
      // const q = "SELECT * FROM `product_master` WHERE product_id = ? and status = 1";

      const q = "SELECT pm.`product_id`, pm.`cate_id`, cm.`category_name`, pm.`product_title`, pm.`product_short_desc`, pm.`product_long_desc`, pm.`meta_tag`, pm.`meta_desc`, pm.`meta_keyword`, pm.`canonical_url`, pm.`product_image`, pm.`product_brochure` FROM `product_master` pm JOIN `product_category` cm ON pm.`cate_id` = cm.`category_id` WHERE pm.`product_id` = ? AND pm.`status` = 1"
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
