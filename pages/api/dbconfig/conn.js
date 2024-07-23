import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_USER_PASS,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  connectionLimit: 10,
});

const conn = pool.promise();

export default conn;
