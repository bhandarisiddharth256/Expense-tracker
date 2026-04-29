import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";

dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());

// test route
app.get("/health", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB connection failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});