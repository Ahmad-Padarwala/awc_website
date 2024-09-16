// pages/api/productCategoryStatus/[[...ids]].js

import { checkApiAuth } from "../../authmiddleware";
import conn from "../../dbconfig/conn";

// export const config = {
//     api: {
//       externalResolver: true,
//     }
//   }

export default async function handler(req, res) {
  const isAuthenticated = checkApiAuth(req, res);
  if (!isAuthenticated) return;

  if (req.method == "PATCH") {
    try {
      // Query the database
      const { ids } = req.query;

      // Destructure the IDs from the array
      const [prod_id, status] = ids;

      if (status == 1) {
        const sql = "UPDATE blog_master SET status=0 WHERE blog_id = ?";
        const [rows] = await conn.query(sql, [prod_id]);

        res.status(200).json(rows);
      } else {
        const sql = "UPDATE blog_master SET status=1 WHERE blog_id = ?";
        const [rows] = await conn.query(sql, [prod_id]);

        res.status(200).json(rows);
      }
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }finally {
      conn.releaseConnection();
    }
  }
}
