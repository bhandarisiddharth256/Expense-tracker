import pool from "../db/index.js";

export const createExpenseService = async ({
  amount,
  category,
  description,
  date,
  idempotency_key,
}) => {
  // 1. Basic validation
  if (!amount || !category || !date || !idempotency_key) {
    throw new Error("Missing required fields");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  // 2. Check if request already processed (IDEMPOTENCY)
  const existing = await pool.query(
    "SELECT * FROM expenses WHERE idempotency_key = $1",
    [idempotency_key]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0]; // return existing expense
  }

  // 3. Insert new expense
  const result = await pool.query(
    `INSERT INTO expenses 
     (amount, category, description, date, idempotency_key)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [amount, category, description, date, idempotency_key]
  );

  return result.rows[0];
};

export const getExpensesService = async ({ category, sort }) => {
  let query = "SELECT * FROM expenses";
  let values = [];

  // 1. Filtering
  if (category) {
    query += " WHERE category = $1";
    values.push(category);
  }

  // 2. Sorting
  if (sort === "date_desc") {
    query += " ORDER BY date DESC";
  } else {
    // default sorting
    query += " ORDER BY date DESC";
  }

  const result = await pool.query(query, values);

  return result.rows;
};