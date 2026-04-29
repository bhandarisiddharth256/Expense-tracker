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
    [idempotency_key],
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
    [amount, category, description, date, idempotency_key],
  );

  return result.rows[0];
};

export const getExpensesService = async ({ category, sort }) => {
  let query = "SELECT * FROM expenses";
  let values = [];
  let conditions = [];

  // ✅ Handle category properly
  if (category) {
    conditions.push(`category = $${values.length + 1}`);
    values.push(category);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // ✅ Handle ALL sorting cases
  let orderBy = "date DESC";

  switch (sort) {
    case "date_asc":
      orderBy = "date ASC";
      break;
    case "date_desc":
      orderBy = "date DESC";
      break;
    case "amount_desc":
      orderBy = "amount DESC";
      break;
    case "amount_asc":
      orderBy = "amount ASC";
      break;
    default:
      orderBy = "date DESC";
  }

  query += ` ORDER BY ${orderBy}`;

  console.log("FINAL QUERY:", query, values); // 🔥 DEBUG

  const result = await pool.query(query, values);
  return result.rows;
};
