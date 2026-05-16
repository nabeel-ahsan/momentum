import express from "express";
import cors from "cors";
import authRouter from './src/routes/authRoute.js'
import sessionRouter from './src/routes/sessionRoute.js'
import { authMiddleware } from "./src/middleware/authMiddleware.js";


const app = express();

app.use(cors());
app.use(express.json());
app.get('/test', authMiddleware, (req, res)=> {
    res.json({user: req.user})
})

app.use("/auth", authRouter);
app.use("/sessions", sessionRouter);

export default app;
