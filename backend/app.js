import express from "express";
import cors from "cors";
import router from './src/routes/authRoute.js'
import { authMiddleware } from "./src/middleware/authMiddleware.js";


const app = express();

app.use(cors());
app.use(express.json());
app.get('/test', authMiddleware, (req, res)=> {
    res.json({user: req.user})
})

app.use("/auth", router);

export default app;
