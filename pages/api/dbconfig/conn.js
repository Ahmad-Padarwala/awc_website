import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "awc_db",
});

const conn = pool.promise();

export default conn;
