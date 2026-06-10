import jwt from "jsonwebtoken";
import "dotenv/config";
import AppError from "../utils/appError.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new AppError("Access denied. No token provided.", 401));
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Access denied. Invalid token format.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please login again.", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token.", 403));
    }

    next(error);
  }
};
