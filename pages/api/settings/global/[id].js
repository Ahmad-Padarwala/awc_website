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
      const q = "SELECT * FROM `global_data` WHERE id = ?";

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
        const { header, footer } = fields;

        let sql = "";
        let params = [];
        sql =
          "UPDATE `global_data` SET `header`=?, `footer`=? WHERE `id` = ?";

        params = [header, footer, id];
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
