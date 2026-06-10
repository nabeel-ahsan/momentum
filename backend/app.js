import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import authRouter from './src/routes/authRoute.js'
import sessionRouter from './src/routes/sessionRoute.js'
import { authMiddleware } from "./src/middleware/authMiddleware.js";
import errorHandler from "./src/middleware/errorHandler.js";
import AppError from "./src/utils/appError.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/test', authMiddleware, (req, res)=> {
    res.json({user: req.user})
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many login/registration attempts from this IP, please try again after 15 minutes."
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
});

app.use("/auth", authLimiter, authRouter);
app.use("/sessions", sessionRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
