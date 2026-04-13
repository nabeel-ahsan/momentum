import express from "express";
import cors from "cors";
import router from './src/routes/authRoute.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", router);

export default app;
