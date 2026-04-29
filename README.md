# 💸 Expense Tracker (Full Stack)

A minimal yet production-oriented **Expense Tracker** built with **React, Node.js, and PostgreSQL (Supabase)**.

The focus of this project is **correctness under real-world conditions**—handling retries, preventing duplicate entries, and ensuring accurate financial data.

---

## 🚀 Live Demo

* 🌐 Frontend: https://expense-tracker-eight-mu-32.vercel.app
* 🔗 Backend API: https://expense-tracker-pc1w.onrender.com

---

## 🧠 Key Highlights

* 🔁 **Idempotent API design** → prevents duplicate expense creation on retries
* 💰 **Reliable money handling** → uses PostgreSQL numeric type (no float errors)
* 🧩 **Strict data modeling** → categories enforced using ENUM
* ⚡ **Efficient queries** → filtering & sorting handled in DB
* 🧪 **Resilient UI** → handles loading, retries, and repeated user actions

---

## ✨ Features

* Add expense (amount, category, description, date)
* View expense list
* Filter by category
* Sort by date & amount
* View total of visible expenses
* Category-wise breakdown
* Pagination support

---

## 🧠 Real-World Considerations

### 🔁 Idempotency (Duplicate Protection)

Each request includes an `idempotency_key`.

* Backend checks if key already exists before inserting
* Ensures safe behavior under:

  * repeated clicks
  * network retries
  * page refresh

---

### 💰 Money Handling

* Stored as **numeric type (rupees)** in PostgreSQL
* Converted safely using `Number()` in frontend

👉 Avoids floating-point precision issues

---

### ⚡ Query Efficiency

* Filtering & sorting handled at SQL level
* Indexed columns improve performance

---

### 🧪 Edge Cases Handled

* Duplicate submissions (idempotency)
* Invalid inputs (amount validation)
* Empty states (no expenses)
* Slow API responses (loading states)
* Network failures (error handling)

---

## 📡 API Endpoints

### ➕ Create Expense

POST `/api/expenses`

```json
{
  "amount": 5000,
  "category": "food",
  "description": "Dinner",
  "date": "2026-04-29",
  "idempotency_key": "unique-key"
}
```

---

### 📥 Get Expenses

GET `/api/expenses?category=food&sort=date_desc`

---

## ⚙️ Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ⚖️ Design Decisions

### Why PostgreSQL?

* Strong consistency guarantees
* Supports constraints and ENUM
* Ideal for financial data

---

### Why Idempotency?

* Prevents duplicate entries in real-world conditions
* Ensures correctness under unreliable networks

---

### Why keep it minimal?

* Focus on correctness over feature bloat
* Easier to maintain and extend

---

## ⚠️ Trade-offs

* No authentication (out of scope)
* Minimal UI complexity
* No advanced analytics

---

## 🚫 What was intentionally NOT built

* Multi-user system
* Complex dashboards
* Over-engineered frontend state

---

## 🏆 What this demonstrates

* Real-world backend thinking
* Data correctness & validation
* Clean full-stack architecture
* Practical engineering judgment

---

## 📬 Submission

* GitHub: https://github.com/bhandarisiddharth256/Expense-tracker.git
* Live App: https://expense-tracker-eight-mu-32.vercel.app

---

## 📌 Final Note

> This project prioritizes correctness, reliability, and maintainability over feature complexity.

---

👨‍💻 Author

Siddharth Bhandari

GitHub: https://github.com/bhandarisiddharth256