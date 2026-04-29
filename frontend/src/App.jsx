import { useState, useMemo } from "react";
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
  gym: "#185fa5",
  other: "#888780",
};

const fmt = (amount) => `₹${Number(amount || 0).toFixed(2)}`;
const fmtDate = (raw) => {
  if (!raw) return "";
  const d = new Date(raw);
  return isNaN(d)
    ? raw
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const PAGE_SIZE = 5;

const s = {
  fullWidthSection: {
    width: "100%",
    padding: "1.5rem 1.75rem",
  },

  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#f5f3ef",
    minHeight: "100vh",
    color: "#1a1814",
  },
  topbar: {
    background: "#ffffff",
    borderBottom: "0.5px solid #e8e4db",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "56px",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  topbarLeft: { display: "flex", alignItems: "baseline", gap: "12px" },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1814",
    margin: 0,
  },
  logoSub: {
    fontSize: "10px",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "#8a867a",
  },
  topbarDate: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#8a867a",
  },
  body: { display: "flex", minHeight: "calc(100vh - 56px)" },

  // Sidebar
  sidebar: {
    width: "300px",
    flexShrink: 0,
    background: "#ffffff",
    borderRight: "0.5px solid #e8e4db",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    overflowY: "auto",
  },

  // Content
  content: {
    flex: 1,
    padding: "1.5rem 1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    minWidth: 0,
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },

  // Stats
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
    gap: "10px",
  },
  statCard: {
    background: "#ffffff",
    border: "0.5px solid #e8e4db",
    borderRadius: "12px",
    padding: "0.875rem 1rem",
  },
  statLabel: {
    fontSize: "9px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#8a867a",
    marginBottom: "5px",
  },
  statValue: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "17px",
    fontWeight: 500,
    color: "#1a1814",
    letterSpacing: "-0.5px",
  },
  statValueAccent: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "17px",
    fontWeight: 500,
    color: "#c4611a",
    letterSpacing: "-0.5px",
  },
  statSub: { fontSize: "10px", color: "#8a867a", marginTop: "3px" },

  // Card
  card: {
    background: "#ffffff",
    border: "0.5px solid #e8e4db",
    borderRadius: "14px",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.25rem",
    borderBottom: "0.5px solid #e8e4db",
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#4a473f",
  },
  accentBar: (color) => ({
    display: "block",
    width: "3px",
    height: "13px",
    background: color,
    borderRadius: "2px",
  }),
  countBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    background: "#f5f3ef",
    border: "0.5px solid #e8e4db",
    color: "#8a867a",
    padding: "2px 8px",
    borderRadius: "20px",
  },

  // Transaction rows
  txRow: {
    display: "grid",
    gridTemplateColumns: "10px 1fr auto", // better spacing
    gap: "16px", // more breathing space
    alignItems: "center",
    padding: "14px 1.5rem", // consistent with card
    borderBottom: "0.5px solid #e8e4db",
  },
  txDot: (cat) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: CAT_COLORS[cat] || "#888780",
    flexShrink: 0,
  }),
  txDesc: { fontSize: "13px", color: "#1a1814", marginBottom: "3px" },
  txMeta: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    fontSize: "10px",
    color: "#8a867a",
  },
  txCatPill: {
    background: "#f3f1ec",
    padding: "1px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 500,
    color: "#4a473f",
    textTransform: "capitalize",
  },
  txAmt: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px",
    fontWeight: 500,
    color: "#1a1814",
    whiteSpace: "nowrap",

    // 🔥 ADD THESE
    textAlign: "right",
    minWidth: "90px",
  },

  // Pagination
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 1.5rem", // match txRow
    borderTop: "0.5px solid #e8e4db",
  },
  pageInfo: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#8a867a",
  },
  pageButtons: { display: "flex", gap: "4px", alignItems: "center" },
  pageBtn: (active, disabled) => ({
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    border: active ? "1px solid #c4611a" : "0.5px solid #e8e4db",
    background: active ? "#c4611a" : "#ffffff",
    color: active ? "#ffffff" : disabled ? "#c8c4bb" : "#4a473f",
    cursor: disabled ? "default" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  }),
  pageDots: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "11px",
    color: "#8a867a",
    padding: "0 4px",
  },

  // Sidebar sections
  secTitle: (color) => ({
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#4a473f",
    marginBottom: "8px",
  }),
  secBar: (color) => ({
    display: "block",
    width: "3px",
    height: "12px",
    background: color,
    borderRadius: "2px",
  }),
  filterGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  filterLabel: {
    fontSize: "10px",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#8a867a",
    fontWeight: 500,
  },
  select: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "#1a1814",
    background: "#f5f3ef",
    border: "0.5px solid #e8e4db",
    borderRadius: "8px",
    padding: "8px 28px 8px 10px",
    outline: "none",
    cursor: "pointer",
    width: "100%",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 12 12'%3E%3Cpath fill='%238a867a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    boxSizing: "border-box",
  },
  dateInput: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "#1a1814",
    background: "#f5f3ef",
    border: "0.5px solid #e8e4db",
    borderRadius: "8px",
    padding: "8px 10px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  dailyAmt: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "20px",
    fontWeight: 500,
    color: "#c4611a",
    marginTop: "8px",
  },
  dailySub: { fontSize: "11px", color: "#8a867a", marginTop: "2px" },
  bkRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 1rem",
    borderBottom: "0.5px solid #e8e4db",
  },
  bkCat: {
    fontSize: "11px",
    color: "#1a1814",
    textTransform: "capitalize",
    width: "80px",
    flexShrink: 0,
  },
  barWrap: {
    flex: 1,
    height: "3px",
    background: "#f0ece4",
    borderRadius: "2px",
    overflow: "hidden",
  },
  bkAmt: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    color: "#4a473f",
    width: "64px",
    textAlign: "right",
    flexShrink: 0,
  },

  divider: { height: "0.5px", background: "#e8e4db" },
  empty: {
    padding: "2.5rem",
    textAlign: "center",
    color: "#8a867a",
    fontSize: "12px",
  },
  loading: {
    padding: "2rem",
    textAlign: "center",
    color: "#8a867a",
    fontSize: "12px",
  },
  errorBox: {
    padding: "0.75rem 1rem",
    background: "#fcebeb",
    border: "0.5px solid #f09595",
    borderRadius: "8px",
    color: "#a32d2d",
    fontSize: "12px",
  },
};

function PaginationBar({ page, totalPages, total, pageSize, onChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page number list with ellipsis
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div style={s.pagination}>
      <span style={s.pageInfo}>
        {total === 0 ? "0 results" : `${from}–${to} of ${total}`}
      </span>
      <div style={s.pageButtons}>
        {/* Prev */}
        <button
          style={s.pageBtn(false, page === 1)}
          onClick={() => page > 1 && onChange(page - 1)}
          disabled={page === 1}
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`d${i}`} style={s.pageDots}>
              …
            </span>
          ) : (
            <button
              key={p}
              style={s.pageBtn(p === page, false)}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          style={s.pageBtn(false, page === totalPages || totalPages === 0)}
          onClick={() => page < totalPages && onChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);

  const handleRefresh = () => {
    setRefreshKey((p) => p + 1);
    setPage(1);
  };
  const { expenses, loading, error } = useExpenses(
    { category, sort },
    refreshKey,
  );

  // Reset to page 1 when filters change
  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };
  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const monthlyTotal = expenses.reduce((sum, e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
      ? sum + Number(e.amount || 0)
      : sum;
  }, 0);
  const now = new Date();

  const avgExpense = expenses.length ? Math.round(total / expenses.length) : 0;

  const catTotals = expenses.reduce((acc, e) => {
    const amt = Number(e.amount || 0);
    acc[e.category] = (acc[e.category] || 0) + amt;
    return acc;
  }, {});
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCats[0]?.[1] || 1;
  const topCat = sortedCats[0];

  const dailyTotal = expenses
    .filter((e) => {
      try {
        return new Date(e.date).toISOString().split("T")[0] === selectedDate;
      } catch {
        return e.date === selectedDate;
      }
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPages = Math.max(1, Math.ceil(expenses.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return expenses.slice(start, start + PAGE_SIZE);
  }, [expenses, page]);

  const dateLabel = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <div style={s.page}>
        {/* Top bar */}
        <div style={s.topbar}>
          <div style={s.topbarLeft}>
            <h1 style={s.logo}>Expense Tracker</h1>
            <span style={s.logoSub}>Personal finance ledger</span>
          </div>
          <div style={s.topbarDate}>{dateLabel}</div>
        </div>

        <div style={s.body}>
          {/* ── Sidebar ── */}
          <aside style={s.sidebar}>
            {/* Add expense form */}
            <ExpenseForm onSuccess={handleRefresh} />

            <div style={s.divider} />

            {/* Filters */}
            <div>
              <div style={s.secTitle()}>
                <span style={s.secBar("#8a867a")} />
                Filter & sort
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div style={s.filterGroup}>
                  <label style={s.filterLabel}>Category</label>
                  <select
                    style={s.select}
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">All categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={s.filterGroup}>
                  <label style={s.filterLabel}>Sort by</label>
                  <select
                    style={s.select}
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="date_desc">Newest first</option>
                    <option value="date_asc">Oldest first</option>
                    <option value="amount_desc">Highest amount</option>
                    <option value="amount_asc">Lowest amount</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={s.divider} />

            {/* Daily lookup
            <div>
              <div style={s.secTitle()}>
                <span style={s.secBar("#c4611a")} />
                Daily lookup
              </div>
              <input
                type="date"
                style={s.dateInput}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate ? (
                <>
                  <div style={s.dailyAmt}>{fmt(dailyTotal)}</div>
                  <div style={s.dailySub}>on {fmtDate(selectedDate)}</div>
                </>
              ) : (
                <div style={{ ...s.dailySub, marginTop: "6px" }}>
                  Pick a date to see total
                </div>
              )}
            </div> */}

            <div style={s.divider} />

            {/* By category */}
            {sortedCats.length > 0 && (
              <div>
                <div style={s.secTitle()}>
                  <span style={s.secBar("#2d6a4f")} />
                  By category
                </div>
                <div
                  style={{
                    background: "#f5f3ef",
                    border: "0.5px solid #e8e4db",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {sortedCats.map(([cat, amt], i) => (
                    <div
                      key={cat}
                      style={{
                        ...s.bkRow,
                        ...(i === sortedCats.length - 1
                          ? { borderBottom: "none" }
                          : {}),
                      }}
                    >
                      <div style={s.bkCat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>
                      <div style={s.barWrap}>
                        <div
                          style={{
                            height: "100%",
                            borderRadius: "2px",
                            width: `${Math.round((amt / maxCat) * 100)}%`,
                            background: CAT_COLORS[cat] || "#888780",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <div style={s.bkAmt}>{fmt(amt)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ── Main ── */}
          <main style={s.content}>
            {/* Stats */}
            <div style={s.statsRow}>
              {[
                {
                  label: "All time",
                  value: fmt(total),
                  sub: `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`,
                  accent: true,
                },
                {
                  label: "This month",
                  value: fmt(monthlyTotal),
                  sub: now.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  }),
                },
                {
                  label: "Average",
                  value: fmt(avgExpense),
                  sub: "per expense",
                },
                {
                  label: "Top category",
                  value: topCat ? topCat[0] : "—",
                  sub: topCat ? fmt(topCat[1]) : "",
                  cap: true,
                },
              ].map(({ label, value, sub, accent, cap }) => (
                <div key={label} style={s.statCard}>
                  <div style={s.statLabel}>{label}</div>
                  <div
                    style={{
                      ...(accent ? s.statValueAccent : s.statValue),
                      ...(cap
                        ? {
                            textTransform: "capitalize",
                            fontSize: "14px",
                            letterSpacing: 0,
                          }
                        : {}),
                    }}
                  >
                    {value}
                  </div>
                  <div style={s.statSub}>{sub}</div>
                </div>
              ))}
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            {/* Transactions with pagination */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>
                  <span style={s.accentBar("#8a867a")} />
                  Transactions
                </div>
                <span style={s.countBadge}>{expenses.length}</span>
              </div>

              {loading && <div style={s.loading}>Loading…</div>}

              {!loading && expenses.length === 0 && (
                <div style={s.empty}>
                  No expenses yet — add one from the sidebar
                </div>
              )}

              {!loading &&
                paginated.map((exp, i) => (
                  <div
                    key={exp.id}
                    style={{
                      ...s.txRow,
                      ...(i === paginated.length - 1
                        ? { borderBottom: "none" }
                        : {}),
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#faf9f6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div style={s.txDot(exp.category)} />
                    <div>
                      <div style={s.txDesc}>
                        {exp.description || exp.category}
                      </div>
                      <div style={s.txMeta}>
                        <span style={s.txCatPill}>{exp.category}</span>
                        <span>{fmtDate(exp.date)}</span>
                      </div>
                    </div>
                    <div style={s.txAmt}>{fmt(exp.amount)}</div>
                  </div>
                ))}

              {!loading && expenses.length > 0 && (
                <PaginationBar
                  page={page}
                  totalPages={totalPages}
                  total={expenses.length}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              )}
            </div>

            {/* CATEGORY BREAKDOWN (FULL WIDTH) */}
            {/* {sortedCats.length > 0 && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>
                    <span style={s.accentBar("#2d6a4f")} />
                    Category breakdown
                  </div>
                </div>

                <div>
                  {sortedCats.map(([cat, amt], i) => (
                    <div
                      key={cat}
                      style={{
                        ...s.bkRow,
                        ...(i === sortedCats.length - 1
                          ? { borderBottom: "none" }
                          : {}),
                      }}
                    >
                      <div style={s.bkCat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>

                      <div style={s.barWrap}>
                        <div
                          style={{
                            height: "100%",
                            borderRadius: "2px",
                            width: `${Math.round((amt / maxCat) * 100)}%`,
                            background: CAT_COLORS[cat] || "#888780",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>

                      <div style={s.bkAmt}>{fmt(amt)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </main>
        </div>

        {/* 🔥 FULL WIDTH CATEGORY BREAKDOWN */}
        {/* {sortedCats.length > 0 && (
          <div style={s.fullWidthSection}>
            <div style={{ ...s.card, maxWidth: "1200px", margin: "0 auto" }}>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>
                  <span style={s.accentBar("#2d6a4f")} />
                  Category breakdown
                </div>
              </div>

              <div>
                {sortedCats.map(([cat, amt], i) => (
                  <div
                    key={cat}
                    style={{
                      ...s.bkRow,
                      ...(i === sortedCats.length - 1
                        ? { borderBottom: "none" }
                        : {}),
                    }}
                  >
                    <div style={s.bkCat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </div>

                    <div style={s.barWrap}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.round((amt / maxCat) * 100)}%`,
                          background: CAT_COLORS[cat] || "#888780",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>

                    <div style={s.bkAmt}>{fmt(amt)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}
