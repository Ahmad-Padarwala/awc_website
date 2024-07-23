// api/category/[id].js

import conn from "../../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";
const { unlink } = require("fs").promises;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `product_certificate` WHERE prod_id = ?";

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

  if (req.method == "DELETE") {
    try {
      console.log("REAC");
      const { id } = req.query;

      // first get product data
      const [product] = await conn.query(
        "SELECT certificate_link FROM  product_certificate WHERE prod_certi_id = ?",
        [id]
      );

      console.log(product);

      // Query for delete data
      const q = "DELETE FROM product_certificate WHERE prod_certi_id = ?";

      const [rows] = await conn.query(q, [id]);

      //check docs awailable or not
      let productCertificate = "";
      if (product.length != 0) {
        productCertificate = product[0].certificate_link;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/products/productCertificate"
        );
        const newPath = path.join(projectDirectory, productCertificate);
        console.log(newPath);
        if (fs.existsSync(newPath)) {
          await unlink(newPath);
        } else {
          console.log(`File does not exist: ${newPath}`);
        }
      }

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Cannot Delete Product certificate... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }
}
