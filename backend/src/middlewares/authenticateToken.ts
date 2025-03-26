import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string; // Ensure it's defined

interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request
        console.log("Token verified successfully");
        next();
    } catch (error) {
        console.log("Forbidden");
        return res.status(403).json({ message: "Forbidden" });
    }
};

export default authenticateToken;
