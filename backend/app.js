import express from "express";
import cors from "cors";
import authRouter from './src/routes/authRoute.js'
import sessionRouter from './src/routes/sessionRoute.js'
import { authMiddleware } from "./src/middleware/authMiddleware.js";
import errorHandler from "./src/middleware/errorHandler.js";
import AppError from "./src/utils/appError.js";

const app = express();

app.use(cors());
app.use(express.json());
app.get('/test', authMiddleware, (req, res)=> {
    res.json({user: req.user})
})

app.use("/auth", authRouter);
app.use("/sessions", sessionRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
