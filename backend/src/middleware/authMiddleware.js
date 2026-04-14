import jwt from "jsonwebtoken";
import "dotenv/config";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied. No tokens provided.",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Access denied. Invalid token format.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        error: "Invalid token.",
      });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
