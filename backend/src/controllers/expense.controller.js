import { createExpenseService } from "../services/expense.service.js";
import { getExpensesService } from "../services/expense.service.js";


export const createExpense = async (req, res) => {
  try {
    const data = req.body;

    const expense = await createExpenseService(data);

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create expense" });
  }
};


export const getExpenses = async (req, res) => {
  try {
    const { category, sort } = req.query;

    const expenses = await getExpensesService({ category, sort });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};