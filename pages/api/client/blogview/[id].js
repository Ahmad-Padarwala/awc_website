import conn from "../../dbconfig/conn";

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

      const q = "SELECT bm.`blog_id`, bm.`blog_cate_id`, bc.`category_title`, bm.`blog_title`, bm.`blog_thumbnail`, bm.`blog_description`, bm.`meta_tag`, bm.`meta_desc`, bm.`meta_keyword`, bm.`canonical_url`, bm.`published_date`, bm.`updated_date` FROM `blog_master` bm JOIN `blog_category` bc ON bm.`blog_cate_id` = bc.`blog_cate_id` WHERE bm.`blog_id` = ? AND bm.`status` = 1"
      
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
