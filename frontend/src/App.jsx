import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";

function App() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");

  const { expenses, loading, error } = useExpenses({ category, sort });

  // 🔥 manual refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const { expenses: refreshedExpenses } = useExpenses(
    { category, sort },
    refreshKey
  );

  const total = refreshedExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense Tracker</h1>

      {/* FORM */}
      <ExpenseForm onSuccess={handleRefresh} />

      {/* Filters */}
      <input
        placeholder="Filter by category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {refreshedExpenses.map((exp) => (
          <li key={exp.id}>
            ₹{exp.amount} - {exp.category} - {exp.description}
          </li>
        ))}
      </ul>

      <h2>Total: ₹{total}</h2>
    </div>
  );
}

export default App;