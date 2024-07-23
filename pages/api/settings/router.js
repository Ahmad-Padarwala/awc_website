import conn from "../dbconfig/conn";

export default async function handler(req, res) {

    if (req.method == "GET") {
        try {
            const userQuery = "SELECT * FROM `user`";
            const [userRows] = await conn.query(userQuery);
            // Process the data and send the response
            res.status(200).json(userRows);
        } catch (err) {
            res.status(401).json({ message: "Connection Error" });
        } finally {
            conn.releaseConnection();
        }

    }
}