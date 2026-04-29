# 💸 Expense Tracker (Production-Focused Full Stack)

A production-oriented **Expense Tracker** built using **React, Node.js, and PostgreSQL (Supabase)**.

This project is intentionally designed around **correctness under real-world conditions**—handling retries, preventing duplicate writes, and ensuring reliable financial data—rather than maximizing features.

---

## 🚀 Live Demo

* 🌐 Frontend: https://expense-tracker-eight-mu-32.vercel.app
* 🔗 Backend API: https://expense-tracker-pc1w.onrender.com

---

## 🎯 Problem Statement

Users should be able to:

* Record expenses reliably
* View, filter, and sort them
* See accurate totals

The system must behave correctly under:

* unreliable networks
* repeated user actions
* page refreshes

---

## 🧠 Core Engineering Focus

### 🔁 Idempotent Writes (Critical)

Each `POST /expenses` request includes an `idempotency_key`.

* Backend checks if key already exists
* If yes → returns existing record
* If no → inserts new record

👉 Guarantees:

* No duplicate entries
* Safe retries
* Correctness under failure conditions

---

### 💰 Money Handling (Data Integrity)

* Stored using PostgreSQL **NUMERIC type (rupees)**
* Converted using `Number()` in frontend

👉 Avoids floating-point precision issues and ensures deterministic totals

---

### ⚡ Server-Driven Data Logic

Filtering, sorting, and aggregation are handled in SQL:

* Category filtering → `WHERE` clause
* Sorting → `ORDER BY`
* Aggregation → computed totals

👉 Keeps frontend simple and ensures consistent results

---

## 🏗 System Architecture

```text
Frontend (Vercel)
      ↓
Backend API (Render)
      ↓
PostgreSQL (Supabase)
```

---

## 🧩 Backend Design

Layered structure for maintainability:

```
backend/
├── routes/        # API endpoints
├── controllers/   # request handling
├── services/      # business logic
├── db/            # database connection
```

👉 Separates concerns → easier to extend and debug

---

## ⚡ Query & Index Strategy

Indexes are aligned with API access patterns:

| Index           | Purpose              |
| --------------- | -------------------- |
| category        | fast filtering       |
| date (DESC)     | efficient sorting    |
| idempotency_key | duplicate prevention |

👉 Ensures performance scales with data growth

---

## 🧪 Real-World Reliability

The system handles:

* **Duplicate clicks** → idempotency
* **Network retries** → safe request handling
* **Slow APIs** → loading states in UI
* **Page refresh after submit** → no duplicate data
* **Invalid input** → backend validation

---

## 📡 API Design

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

Supports:

* filtering (`category`)
* sorting (`date`, `amount`)

---

## ⚙️ Local Setup

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

## ⚖️ Key Design Decisions

### Why PostgreSQL?

* Strong data consistency
* Supports constraints & ENUM
* Ideal for financial data

---

### Why Idempotency?

* Prevents duplicate financial entries
* Required for real-world API reliability

---

### Why Minimal UI?

* Focus on correctness and system behavior
* Avoid unnecessary complexity

---

## ⚠️ Trade-offs (Time-Constrained Decisions)

| Decision              | Rationale                       |
| --------------------- | ------------------------------- |
| No authentication     | Out of scope for assignment     |
| No advanced analytics | Focus on core correctness       |
| Simple UI             | Prioritized backend reliability |

---

## 🚫 What was intentionally NOT built

* Multi-user system
* Authentication layer
* Complex dashboards
* Over-engineered state management

👉 Keeps system focused and maintainable

---

## 🏆 What This Project Demonstrates

* Real-world API design thinking
* Handling retries and edge cases
* Data correctness in financial systems
* Clean full-stack architecture

---

## 🚀 Deployment Notes

* Backend hosted on Render (free tier)
* Frontend hosted on Vercel

⚠️ First request may take a few seconds due to cold start

---

## 👨‍💻 Author

**Siddharth Bhandari**

* GitHub: https://github.com/bhandarisiddharth256

---

## 📌 Final Note

> This project prioritizes correctness, reliability, and maintainability over feature complexity—mirroring real-world engineering priorities.
