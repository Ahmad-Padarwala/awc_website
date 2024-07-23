import conn from "../../dbconfig/conn";

export default async function handler(req, res) {
    if (req.method == "GET") {
        try {
            const socialQuery = "SELECT * FROM `social_links`";
            const [socialRows] = await conn.query(socialQuery);
            res.status(200).json(socialRows);
        } catch (err) {
            res.status(401).json({ message: "Connection Error" });
        } finally {
            conn.releaseConnection();
        }
    }
}