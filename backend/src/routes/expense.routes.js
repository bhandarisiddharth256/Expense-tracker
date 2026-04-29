import express from "express";
import {
  createExpense,
  getExpenses,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);

export default router;