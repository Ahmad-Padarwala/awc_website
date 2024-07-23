// pages/api/productCategoryStatus/[[...ids]].js

import conn from "../../dbconfig/conn";

// export const config = {
//     api: {
//       externalResolver: true,
//     }
//   }

export default async function handler(req, res) {
  if (req.method == "GET") {
    try {
      // Query the database

      const q = "SELECT * FROM `blog_category` where status=1";
      const [rows] = await conn.query(q);

      // Process the data and send the response
      res.status(200).send(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }finally {
      conn.releaseConnection();
    }
  }
}
