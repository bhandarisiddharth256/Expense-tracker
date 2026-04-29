import { useState } from "react";
import { CATEGORIES } from "../constants/categories";

const API_URL = import.meta.env.VITE_API_URL;

const generateKey = () => crypto.randomUUID();

export default function ExpenseForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hover, setHover] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!date) {
      setError("Please pick a date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        amount: Math.round(Number(amount) * 100), // ₹ → paise
        category,
        description: description.trim() || category,
        date,
        idempotency_key: generateKey(), // 🔥 IMPORTANT
      };

      const res = await fetch(`${API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to add expense");
      }

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
  const s = {
    card: {
      background: "#ffffff",
      border: "0.5px solid #e8e4db",
      borderRadius: "16px",
      padding: "1.5rem 1.5rem 1.75rem",
      marginBottom: "2rem",
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "1.25rem",
    },
    titleBar: {
      display: "block",
      width: "3px",
      height: "16px",
      background: "#c4611a",
      borderRadius: "2px",
    },
    title: {
      fontSize: "13px",
      fontWeight: 500,
      color: "#4a473f",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "14px",
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    fieldFull: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      gridColumn: "1 / -1",
    },
    label: {
      fontSize: "10px",
      color: "#8a867a",
    },
    input: {
      border: "0.5px solid #e8e4db",
      borderRadius: "8px",
      padding: "10px",
    },
    select: {
      border: "0.5px solid #e8e4db",
      borderRadius: "8px",
      padding: "10px",
    },
    amountWrap: {
      position: "relative",
    },
    amountPrefix: {
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
    },
    amountInput: {
      padding: "10px 10px 10px 25px",
      border: "0.5px solid #e8e4db",
      borderRadius: "8px",
    },
    divider: {
      height: "1px",
      background: "#e8e4db",
      gridColumn: "1 / -1",
    },
    btn: {
      gridColumn: "1 / -1",
      padding: "12px",
      background: "#c4611a",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
    errorMsg: {
      color: "red",
      gridColumn: "1 / -1",
    },
  };
  return (
    <div style={s.card}>
      <div style={s.titleRow}>
        <span style={s.titleBar} />
        <span style={s.title}>Add expense</span>
      </div>

      <div style={s.grid}>
        {/* Amount */}
        <div style={s.field}>
          <label style={s.label}>Amount</label>
          <div style={s.amountWrap}>
            <span style={s.amountPrefix}>₹</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={s.amountInput}
              onFocus={(e) => (e.target.style.borderColor = "#c4611a")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e4db")}
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
            onFocus={(e) => (e.target.style.borderColor = "#c4611a")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e4db")}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={s.fieldFull}>
          <label style={s.label}>Description</label>
          <input
            type="text"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={s.input}
            onFocus={(e) => (e.target.style.borderColor = "#c4611a")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e4db")}
          />
        </div>

        {/* Date */}
        <div style={s.fieldFull}>
          <label style={s.label}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={s.input}
            onFocus={(e) => (e.target.style.borderColor = "#c4611a")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e4db")}
          />
        </div>

        {/* Divider */}
        <div style={s.divider} />

        {/* Error */}
        {error && <div style={s.errorMsg}>{error}</div>}

        {/* Button */}
        <button
          style={{
            ...s.btn,
            background: hover ? "#a85216" : "#c4611a",
            transform: loading ? "scale(0.99)" : "scale(1)",
            opacity: loading ? 0.8 : 1,
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Adding…" : "Add expense"}
        </button>
      </div>
    </div>
  );
}
