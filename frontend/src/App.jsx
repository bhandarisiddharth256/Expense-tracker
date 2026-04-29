import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import { CATEGORIES } from "./constants/categories";
function App() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ✅ ONLY ONE HOOK
  const { expenses, loading, error } = useExpenses(
    { category, sort },
    refreshKey,
  );

  // ✅ total calculation
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense Tracker</h1>

      {/* FORM */}
      <ExpenseForm onSuccess={handleRefresh} />

      {/* Filters */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="date_desc">Newest First</option>
        <option value="date_asc">Oldest First</option>
        <option value="amount_desc">Highest Expense</option>
        <option value="amount_asc">Lowest Expense</option>
      </select>

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

      {/* Total */}
      <h2>Total: ₹{total}</h2>
    </div>
  );
}

export default App;
