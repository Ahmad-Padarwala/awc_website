import conn from "../dbconfig/conn";
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { username, password } = req.body;

    try {
      // Query the database
      const q = `select * from user where username = ? and password = ?`;

      const secretKey = process.env.NEXT_PUBLIC_AWT_SECRET_KEY
      const [rows] = await conn.query(q, [username, password]);
      const token = jwt.sign({ username, password }, secretKey, { expiresIn: '1m' }); 

      if (rows.length > 0) {
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "password incorrect" });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(502).json({ error: "Connection Error" });
    }finally {
      conn.releaseConnection();
    }
  }

  
}
