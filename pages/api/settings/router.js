import { checkApiAuth } from "../authmiddleware";
import conn from "../dbconfig/conn";

export default async function handler(req, res) {
    const isAuthenticated = checkApiAuth(req, res);
    if (!isAuthenticated) return;
    if (req.method == "GET") {
        try {
            const userQuery = `select email, number, favicon, logo from user`;
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