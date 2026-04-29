import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import { CATEGORIES } from "./constants/categories";

const CAT_COLORS = {
  food: "#c4611a",
  transport: "#185fa5",
  shopping: "#993356",
  utilities: "#0f6e56",
  health: "#2d6a4f",
  entertainment: "#534ab7",
  travel: "#185fa5",
  other: "#888780",
};

const fmt = (amount) => `₹${(amount / 100).toFixed(2)}`;

// Formats "2026-04-28T18:30:00.000Z" or "2026-04-28" → "28 Apr 2026"
const fmtDate = (raw) => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const s = {
  shell: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "2rem 1.5rem 4rem",
    fontFamily: "'DM Sans', sans-serif",
    background: "#faf9f6",
    minHeight: "100vh",
    color: "#1a1814",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "2.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #e8e4db",
  },
  h1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "28px",
    fontWeight: 600,
    letterSpacing: "-0.5px",
    color: "#1a1814",
    margin: 0,
  },
  headerSub: { fontSize: "11px", color: "#8a867a", marginTop: "3px", letterSpacing: "0.5px", textTransform: "uppercase" },
  headerDate: { fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#8a867a", textAlign: "right", lineHeight: 1.7 },
  stats: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", marginBottom: "2rem" },
  statCard: { background: "#ffffff", border: "0.5px solid #e8e4db", borderRadius: "12px", padding: "1rem 1.25rem" },
  statLabel: { fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#8a867a", marginBottom: "6px" },
  statValue: { fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 500, color: "#1a1814", letterSpacing: "-0.5px" },
  statValueAccent: { fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 500, color: "#c4611a", letterSpacing: "-0.5px" },
  statSub: { fontSize: "11px", color: "#8a867a", marginTop: "4px" },
  sectionTitle: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500, color: "#4a473f" },
  sectionBar: (color) => ({ display: "block", width: "3px", height: "14px", background: color, borderRadius: "2px", flexShrink: 0 }),
  filtersCard: { background: "#ffffff", border: "0.5px solid #e8e4db", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.75rem" },
  filtersRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  filterGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  filterLabel: { fontSize: "10px", letterSpacing: "0.8px", textTransform: "uppercase", color: "#8a867a", fontWeight: 500 },
  select: {
    fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1a1814",
    background: "#faf9f6", border: "0.5px solid #e8e4db", borderRadius: "8px",
    padding: "9px 36px 9px 12px", outline: "none", cursor: "pointer", width: "100%",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a867a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", boxSizing: "border-box",
  },
  listCard: { background: "#ffffff", border: "0.5px solid #e8e4db", borderRadius: "16px", overflow: "hidden", marginBottom: "1.5rem" },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "0.5px solid #e8e4db" },
  countBadge: { fontFamily: "'DM Mono', monospace", fontSize: "11px", background: "#faf9f6", border: "0.5px solid #e8e4db", color: "#8a867a", padding: "2px 10px", borderRadius: "20px" },
  expenseRow: { display: "grid", gridTemplateColumns: "20px 1fr auto", gap: "14px", alignItems: "center", padding: "14px 1.25rem", borderBottom: "0.5px solid #e8e4db" },
  catDot: (cat) => ({ width: "8px", height: "8px", borderRadius: "50%", background: CAT_COLORS[cat] || "#888780", justifySelf: "center" }),
  expDesc: { fontSize: "14px", color: "#1a1814", fontWeight: 400, marginBottom: "3px" },
  expMeta: { display: "flex", gap: "10px", fontSize: "11px", color: "#8a867a", alignItems: "center" },
  expCat: { textTransform: "capitalize", background: "#f3f1ec", padding: "1px 7px", borderRadius: "4px", fontSize: "10px", letterSpacing: "0.3px", fontWeight: 500, color: "#4a473f" },
  expAmount: { fontFamily: "'DM Mono', monospace", fontSize: "14px", fontWeight: 500, color: "#1a1814", whiteSpace: "nowrap" },
  empty: { padding: "2.5rem", textAlign: "center", color: "#8a867a", fontSize: "13px" },
  loading: { padding: "2rem", textAlign: "center", color: "#8a867a", fontSize: "13px" },
  errorBox: { padding: "0.75rem 1rem", background: "#fcebeb", border: "0.5px solid #f09595", borderRadius: "8px", color: "#a32d2d", fontSize: "13px", marginBottom: "1rem" },
  breakdownCard: { background: "#ffffff", border: "0.5px solid #e8e4db", borderRadius: "16px", overflow: "hidden", marginBottom: "1.5rem" },
  breakdownHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "0.5px solid #e8e4db" },
  breakdownRow: { display: "flex", alignItems: "center", gap: "12px", padding: "11px 1.25rem", borderBottom: "0.5px solid #e8e4db" },
  breakdownCat: { fontSize: "13px", color: "#1a1814", textTransform: "capitalize", width: "100px", flexShrink: 0 },
  barWrap: { flex: 1, height: "4px", background: "#f0ece4", borderRadius: "2px", overflow: "hidden" },
  breakdownAmt: { fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#4a473f", width: "80px", textAlign: "right", flexShrink: 0 },
  dateCard: { background: "#ffffff", border: "0.5px solid #e8e4db", borderRadius: "16px", padding: "1.25rem" },
  dateRow: { display: "flex", alignItems: "center", gap: "12px", marginTop: "1rem", flexWrap: "wrap" },
  dateInput: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#1a1814", background: "#faf9f6", border: "0.5px solid #e8e4db", borderRadius: "8px", padding: "9px 12px", outline: "none", flex: 1, minWidth: "160px" },
  dailyResult: { fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 500, color: "#c4611a" },
};

function App() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);
  const { expenses, loading, error } = useExpenses({ category, sort }, refreshKey);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const now = new Date();
  const monthlyTotal = expenses.reduce((sum, e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() ? sum + e.amount : sum;
  }, 0);

  const catTotals = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCats[0]?.[1] || 1;
  const topCat = sortedCats[0];

  const dailyTotal = expenses
    .filter((e) => new Date(e.date).toISOString().split("T")[0] === selectedDate || e.date === selectedDate)
    .reduce((sum, e) => sum + e.amount, 0);

  const dateLabel = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={s.shell}>

        <header style={s.header}>
          <div>
            <h1 style={s.h1}>Expense Tracker</h1>
            <p style={s.headerSub}>Personal finance ledger</p>
          </div>
          <div style={s.headerDate}>{dateLabel}</div>
        </header>

        <div style={s.stats}>
          <div style={s.statCard}>
            <div style={s.statLabel}>All time</div>
            <div style={s.statValueAccent}>{fmt(total)}</div>
            <div style={s.statSub}>{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>This month</div>
            <div style={s.statValue}>{fmt(monthlyTotal)}</div>
            <div style={s.statSub}>{now.toLocaleString("default", { month: "long", year: "numeric" })}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>Top category</div>
            <div style={{ ...s.statValue, fontSize: "15px", textTransform: "capitalize", letterSpacing: 0 }}>
              {topCat ? topCat[0] : "—"}
            </div>
            <div style={s.statSub}>{topCat ? fmt(topCat[1]) : ""}</div>
          </div>
        </div>

        <ExpenseForm onSuccess={handleRefresh} />

        {error && <div style={s.errorBox}>{error}</div>}

        <div style={s.filtersCard}>
          <div style={s.filtersRow}>
            <div style={s.filterGroup}>
              <label style={s.filterLabel}>Category</label>
              <select style={s.select} value={category} onChange={(e) => setCategory(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#c4611a")} onBlur={(e) => (e.target.style.borderColor = "#e8e4db")}>
                <option value="">All categories</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
            </div>
            <div style={s.filterGroup}>
              <label style={s.filterLabel}>Sort by</label>
              <select style={s.select} value={sort} onChange={(e) => setSort(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#c4611a")} onBlur={(e) => (e.target.style.borderColor = "#e8e4db")}>
                <option value="date_desc">Newest first</option>
                <option value="date_asc">Oldest first</option>
                <option value="amount_desc">Highest amount</option>
                <option value="amount_asc">Lowest amount</option>
              </select>
            </div>
          </div>
        </div>

        <div style={s.listCard}>
          <div style={s.listHeader}>
            <div style={s.sectionTitle}><span style={s.sectionBar("#8a867a")} />Transactions</div>
            <span style={s.countBadge}>{expenses.length}</span>
          </div>
          {loading && <div style={s.loading}>Loading…</div>}
          {!loading && expenses.length === 0 && <div style={s.empty}>No expenses yet — add one above</div>}
          {!loading && expenses.map((exp, i) => (
            <div key={exp.id}
              style={{ ...s.expenseRow, ...(i === expenses.length - 1 ? { borderBottom: "none" } : {}) }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#faf9f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <div style={s.catDot(exp.category)} />
              <div>
                <div style={s.expDesc}>{exp.description || exp.category}</div>
                <div style={s.expMeta}>
                  <span style={s.expCat}>{exp.category}</span>
                  <span>{fmtDate(exp.date)}</span>
                </div>
              </div>
              <div style={s.expAmount}>{fmt(exp.amount)}</div>
            </div>
          ))}
        </div>

        {sortedCats.length > 0 && (
          <div style={s.breakdownCard}>
            <div style={s.breakdownHeaderRow}>
              <div style={s.sectionTitle}><span style={s.sectionBar("#2d6a4f")} />Category breakdown</div>
            </div>
            {sortedCats.map(([cat, amt], i) => (
              <div key={cat} style={{ ...s.breakdownRow, ...(i === sortedCats.length - 1 ? { borderBottom: "none" } : {}) }}>
                <div style={s.breakdownCat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                <div style={s.barWrap}>
                  <div style={{ height: "100%", borderRadius: "2px", width: `${Math.round((amt / maxCat) * 100)}%`, background: CAT_COLORS[cat] || "#888780", transition: "width 0.4s ease" }} />
                </div>
                <div style={s.breakdownAmt}>{fmt(amt)}</div>
              </div>
            ))}
          </div>
        )}

        {/* <div style={s.dateCard}>
          <div style={s.sectionTitle}><span style={s.sectionBar("#c4611a")} />Daily lookup</div>
          <div style={s.dateRow}>
            <input type="date" style={s.dateInput} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#c4611a")} onBlur={(e) => (e.target.style.borderColor = "#e8e4db")} />
            <div style={s.dailyResult}>{selectedDate ? fmt(dailyTotal) : "—"}</div>
          </div>
        </div> */}

      </div>
    </>
  );
}

export default App;