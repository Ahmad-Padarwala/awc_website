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
      const q = "SELECT * FROM `pages_seo` WHERE id = ?";

      const data = [id];
      const [rows] = await conn.query(q, data);

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Can not Get category... check connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const {
          home_title,
          home_keyword,
          home_desc,
          home_canonical,
          about_title,
          about_keyword,
          about_desc,
          about_canonical,
          product_title,
          product_keyword,
          product_desc,
          product_canonical,
          gallery_title,
          gallery_keyword,
          gallery_desc,
          gallery_canonical,
          carrer_title,
          carrer_keyword,
          carrer_desc,
          carrer_canonical,
          blog_title,
          blog_keyword,
          blog_desc,
          blog_canonical,
          testimonial_title,
          testimonial_keyword,
          testimonial_desc,
          testimonial_canonical,
          privacy_title,
          privacy_keyword,
          privacy_desc,
          privacy_canonical,
        } = fields;

        let sql = "";
        let params = [];
        sql =
          "UPDATE `pages_seo` SET `home_title`= ?, `home_keyword`= ?, `home_desc`= ?, `home_canonical`= ?, `about_title`= ?, `about_keyword`= ?, `about_desc`= ?, `about_canonical`= ?, `product_title`= ?, `product_keyword`= ?, `product_desc`= ?, `product_canonical`= ?, `gallery_title`= ?, `gallery_keyword`= ?, `gallery_desc`= ?, `gallery_canonical`= ?, `carrer_title`= ?, `carrer_keyword`= ?, `carrer_desc`= ?, `carrer_canonical`= ?, `blog_title`= ?, `blog_keyword`= ?, `blog_desc`= ?, `blog_canonical`= ?, `testimonial_title`= ?, `testimonial_keyword`= ?, `testimonial_desc`= ?, `testimonial_canonical`= ?, `privacy_title`= ?, `privacy_keyword`= ?, `privacy_desc`= ?, `privacy_canonical`= ? WHERE `id` = ?";

        params = [
          home_title,
          home_keyword,
          home_desc,
          home_canonical,
          about_title,
          about_keyword,
          about_desc,
          about_canonical,
          product_title,
          product_keyword,
          product_desc,
          product_canonical,
          gallery_title,
          gallery_keyword,
          gallery_desc,
          gallery_canonical,
          carrer_title,
          carrer_keyword,
          carrer_desc,
          carrer_canonical,
          blog_title,
          blog_keyword,
          blog_desc,
          blog_canonical,
          testimonial_title,
          testimonial_keyword,
          testimonial_desc,
          testimonial_canonical,
          privacy_title,
          privacy_keyword,
          privacy_desc,
          privacy_canonical,
          id,
        ];
        const result = await conn.query(sql, params);
        res.status(200).json(result);
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Cannot update Category... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }
}
