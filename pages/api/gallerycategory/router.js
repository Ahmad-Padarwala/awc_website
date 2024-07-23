import conn from "../dbconfig/conn";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { category_title } = req.body;
      const insertGalleryCategory =
        "INSERT INTO `gallery_category`(`category_title`) VALUES (?)";
      const values = [category_title];
      const [result] = await conn.query(insertGalleryCategory, values);
      res.status(200).json({ message: "Gallery Category Successfully Added" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Category Failed to Add... Check connection" });
    }
  }

  if (req.method == "GET") {
    try {
      // Query the database
      const getGalleryCategory = "SELECT * FROM `gallery_category`";

      const [rows] = await conn.query(getGalleryCategory);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
