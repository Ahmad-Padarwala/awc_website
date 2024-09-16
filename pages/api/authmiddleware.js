import { Api_keys } from "@/components/key";

export const checkApiAuth = (req, res) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== Api_keys) {
        res.status(401).json({ error: "Access Denied" });
        return false;  // Return false if authentication fails
    }
    
    return true;  // Return true if authentication is successful
};