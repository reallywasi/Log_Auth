import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

export default async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Check if authorization header exists

        if (!token) {
            return res.status(401).json({ error: "Authorization token not provided" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token

        req.user = decodedToken; // Attach decoded token to request object

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Authentication Failed!" });
    }
}
