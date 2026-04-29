import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";
dotenv.config();

import expenseRoutes from "./routes/expense.routes.js";

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

app.use("/api", expenseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});