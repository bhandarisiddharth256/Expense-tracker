import { useState } from "react";
import { CATEGORIES } from "../constants/categories";

const API_URL = import.meta.env.VITE_API_URL;

// 🔥 idempotency key
const generateKey = () => crypto.randomUUID();

const s = {
  wrap: {},

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "1rem",
  },

  titleBar: {
    width: "3px",
    height: "14px",
    background: "#c4611a",
    borderRadius: "2px",
  },

  title: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#4a473f",
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  label: {
    fontSize: "10px",
    textTransform: "uppercase",
    color: "#8a867a",
  },

  inputBase: {
    fontSize: "13px",
    color: "#1a1814",
    background: "#ffffff",
    border: "1px solid #d6d2c8",
    borderRadius: "8px",
    padding: "9px 11px",
    width: "100%",
    boxSizing: "border-box",
    paddingRight: "36px", // ✅ room for calendar icon
    colorScheme: "light", // ✅ forces icon to show in light mode
  },

  amountWrap: {
    position: "relative",
  },

  amountPrefix: {
    position: "absolute",
    left: "11px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#c4611a",
    fontWeight: 600,
  },

  amountInput: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1814",
    background: "#ffffff",
    border: "1px solid #d6d2c8",
    borderRadius: "8px",
    padding: "9px 11px 9px 28px",
    width: "100%",
    boxSizing: "border-box", // ✅ FIX
  },

  select: {
    fontSize: "13px",
    color: "#1a1814",
    background: "#ffffff",
    border: "1px solid #d6d2c8",
    borderRadius: "8px",
    padding: "9px 11px",
    width: "100%",
    boxSizing: "border-box", // ✅ FIX
  },

  divider: {
    height: "0.5px",
    background: "#e8e4db",
  },

  btn: {
    width: "100%",
    padding: "11px",
    background: "#c4611a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s ease",
  },

  errorMsg: {
    fontSize: "12px",
    color: "#a32d2d",
    background: "#fcebeb",
    border: "0.5px solid #f09595",
    borderRadius: "6px",
    padding: "7px 10px",
  },
};

const focus = (e) => (e.target.style.borderColor = "#c4611a");
const blur = (e) => (e.target.style.borderColor = "#d6d2c8");

export default function ExpenseForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    // ✅ validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return setError("Enter a valid amount.");
    }
    if (!category) {
      return setError("Select a category.");
    }
    if (!date) {
      return setError("Pick a date.");
    }

    setLoading(true);

    try {
      const payload = {
        amount: Number(amount),
        category,
        description: description.trim() || category,
        date,
        idempotency_key: generateKey(), // 🔥 prevents duplicate
      };

      const res = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      // reset form
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");

      onSuccess?.();
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.titleRow}>
        <span style={s.titleBar} />
        <span style={s.title}>Add expense</span>
      </div>

      <div style={s.grid}>
        <div style={s.row2}>
          {/* Amount */}
          <div style={s.field}>
            <label style={s.label}>Amount</label>
            <div style={s.amountWrap}>
              <span style={s.amountPrefix}>₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={s.amountInput}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          </div>

          {/* Category */}
          <div style={s.field}>
            <label style={s.label}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={s.select}
              onFocus={focus}
              onBlur={blur}
            >
              <option value="">Select</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={s.field}>
          <label style={s.label}>Description</label>
          <input
            type="text"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={s.inputBase}
            onFocus={focus}
            onBlur={blur}
          />
        </div>

        {/* Date */}
        <div style={s.field}>
          <label style={s.label}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={s.inputBase}
            onFocus={focus}
            onBlur={blur}
          />
        </div>

        <div style={s.divider} />

        {error && <div style={s.errorMsg}>{error}</div>}

        <button
          style={{
            ...s.btn,
            opacity: loading ? 0.7 : 1,
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add expense"}
        </button>
      </div>
    </div>
  );
}
