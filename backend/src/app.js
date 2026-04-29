import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";
dotenv.config();

import expenseRoutes from "./routes/expense.routes.js";

const app = express();

// middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://expense-tracker-eight-mu-32.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
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