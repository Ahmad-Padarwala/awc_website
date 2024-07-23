import conn from "../dbconfig/conn";


export default async function handler(req, res) {
  // Handling POST request for adding a testimonial
  if (req.method === "POST") {
    console.log(req.body);
    console.log("ss")
    const { testimonial_title, testimonial_video, product_id } = req.body;
    try {
      const row = await conn.query("INSERT INTO testimonial_video SET ? ", {
        title: testimonial_title,
        link: testimonial_video,
        product_id: product_id
      });
      res.status(200).json(row);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to Add Career Job" });
    } finally {
      conn.releaseConnection();
    }
  }


  // Handling GET request for fetching testimonials
  if (req.method == "GET") {
    try {
      // Query the database to fetch all testimonials
      const fetchQuery = "SELECT * FROM `testimonial_video` ORDER BY id DESC";

      // Execute the query
      const [rows] = await conn.query(fetchQuery);

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
