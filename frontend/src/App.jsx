import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";

function App() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");

  const { expenses, loading, error } = useExpenses({ category, sort });

  // 🔥 TOTAL CALCULATION
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense Tracker</h1>

      {/* Filters */}
      <div>
        <input
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="date_desc">Newest First</option>
        </select>
      </div>

      {/* States */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* List */}
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            ₹{exp.amount} - {exp.category} - {exp.description}
          </li>
        ))}
      </ul>

      {/* 🔥 TOTAL */}
      <h2>Total: ₹{total}</h2>
    </div>
  );
}

export default App;