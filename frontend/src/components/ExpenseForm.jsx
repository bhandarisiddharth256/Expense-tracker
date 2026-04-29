import { useState } from "react";
import { createExpense } from "../api/expense.api";

// simple unique key generator
const generateKey = () => crypto.randomUUID();

const ExpenseForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        amount: Number(form.amount), // send in paise if needed
        category: form.category,
        description: form.description,
        date: form.date,
        idempotency_key: generateKey(),
      };

      await createExpense(payload);

      // reset form
      setForm({
        amount: "",
        category: "",
        description: "",
        date: "",
      });

      onSuccess(); // refresh list
    } catch (error) {
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;