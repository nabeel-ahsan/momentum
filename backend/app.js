import "dotenv/config";
import { dbConnection } from "./src/config/db.js";
import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;

dbConnection();
app.use(cors());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log("Server is running");
});
