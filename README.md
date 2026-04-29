# 💸 Expense Tracker (Full Stack)

A minimal yet production-minded **Expense Tracker** built with the MERN stack (React + Node.js) and PostgreSQL (via Supabase).

This project focuses on **correctness under real-world conditions**—handling retries, preventing duplicate entries, and ensuring accurate money calculations—rather than just feature completeness.

---

## 🚀 Live Demo

* 🌐 Frontend: *[Add your deployed frontend link here]*
* 🔗 Backend API: *[Add your backend URL here]*

---

## 🧠 Key Highlights

* 🔁 **Idempotent API design** → prevents duplicate expenses on retries
* 💰 **Accurate money handling** → stored as integers (paise), no floating-point errors
* 🧩 **Consistent data modeling** → category enforced via ENUM
* ⚡ **Fast queries** → filtering & sorting handled at DB level
* 🧪 **Resilient UI** → handles loading, errors, repeated clicks

---

## 📦 Tech Stack

### Frontend

* React (Vite)
* Inline styling (custom design system)
* Fetch API

### Backend

* Node.js + Express
* PostgreSQL (via Supabase)

### Database

* PostgreSQL
* ENUM types for categories
* Indexed queries for performance

---

## ✨ Features

### Core (Assignment Requirements)

* Add expense (amount, category, description, date)
* View list of expenses
* Filter by category
* Sort by date (newest first)
* View total of current list

### Additional Enhancements

* Category-wise breakdown (analytics view)
* Monthly total calculation
* Pagination support
* Clean UI with dashboard layout

---

## 🧠 Real-World Considerations (Important)

### 🔁 Idempotency (Duplicate Protection)

Each request includes an `idempotency_key`.

* If the same request is retried → **no duplicate entry is created**
* Ensures correctness under:

  * multiple button clicks
  * network retries
  * page refresh

---

### 💰 Money Handling

* Stored as **integer (paise)** in DB
* Converted to ₹ in UI

👉 Avoids floating-point precision issues

---

### 🗂 Category Consistency

* Database uses **ENUM**
* Frontend uses **dropdown**

👉 Prevents invalid or inconsistent categories

---

### ⚡ Query Efficiency

* Filtering and sorting handled in SQL
* Indexed fields for fast reads

---

## 📡 API Endpoints

### ➕ Create Expense

```http
POST /api/expenses
```

**Body:**

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

```http
GET /api/expenses?category=food&sort=date_desc
```

**Query Params:**

* `category` → filter by category
* `sort` → `date_desc`, `date_asc`, `amount_desc`, `amount_asc`

---

## 🏗 Project Structure

```
expense-tracker/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── db/
│   │   └── app.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── App.jsx
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone repo

```bash
git clone <your-repo-link>
cd expense-tracker
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
DATABASE_URL=your_postgres_url
PORT=5000
```

Run:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

## ⚖️ Design Decisions

### Why PostgreSQL?

* Strong data integrity
* Supports ENUM & constraints
* Better for structured financial data

---

### Why ENUM for category?

* Prevents invalid values
* Ensures consistency across system

---

### Why Idempotency?

* Real-world APIs must handle retries safely
* Prevents duplicate financial entries

---

## ⚠️ Trade-offs

* ❌ No authentication (out of scope)
* ❌ Minimal UI styling (focus on correctness)
* ❌ No charts/graphs (kept system simple)

---

## 🚫 What I intentionally did NOT build

* Complex analytics dashboard
* Multi-user system
* Over-engineered frontend state management

👉 Focus was on **correctness, reliability, and clean design**

---

## 🏆 What this project demonstrates

* Thinking beyond CRUD
* Handling real-world edge cases
* Clean architecture
* Strong understanding of data correctness

---

## 📌 Final Note

This project prioritizes:

> **"Building the right things correctly" over building many things imperfectly.**

---

## 📬 Submission

* GitHub Repo: (https://github.com/bhandarisiddharth256/Expense-tracker.git)
* Live App: *[coming soon]*

---
