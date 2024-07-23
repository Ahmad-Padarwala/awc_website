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

      const q = "SELECT `prod_image_id`, `image_title`, `product_image`, `sort_image`, `image_width`, `image_height`, `alternative` FROM `product_images` WHERE `product_id` = ? and `status` = 1"
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
