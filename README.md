# Quiz & Orders Dashboard — Full Stack Project

A full-stack web application built with **Node.js/Express** and **React/Vite**. It combines a quiz management system with an orders dashboard featuring data-driven insights and simple machine-learning-style analytics.

---

## Features

### Backend
- RESTful API built with Express
- Modular architecture: controllers, services, routes, utils
- Centralized error handling with consistent JSON error responses
- Input validation on all write endpoints
- CORS enabled, JSON body parsing
- Environment-based configuration via `.env`

### Frontend
- React 18 with functional components and hooks
- Client-side routing via React Router v6
- Axios for API communication, proxied through Vite
- Dashboard with live stat cards, order form, orders table, and insights
- Animated loading spinners and user-friendly error messages
- Auto-refreshing data after order submission

### Orders & Insights
- Add orders with product, quantity, and price
- Automatic date stamping
- Data-driven analytics: top products, busiest hours, restock recommendations, sales by day
- Bar charts via Chart.js / react-chartjs-2

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios  |
| Charts    | Chart.js, react-chartjs-2               |
| Backend   | Node.js, Express                        |
| Dev Tools | Nodemon, dotenv                         |

---

## Project Structure

```
quiz-project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── insightController.js
│   │   │   ├── orderController.js
│   │   │   └── quizController.js
│   │   ├── routes/
│   │   │   ├── insightRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── quizRoutes.js
│   │   ├── services/
│   │   │   ├── insightService.js
│   │   │   ├── orderService.js
│   │   │   └── quizService.js
│   │   ├── utils/
│   │   │   ├── createError.js
│   │   │   └── errorHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddOrderForm.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrdersTable.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── QuizDetailPage.jsx
│   │   │   └── QuizListPage.jsx
│   │   ├── services/
│   │   │   ├── insightService.js
│   │   │   ├── orderService.js
│   │   │   └── quizService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs at **http://localhost:5000**

> For production: `npm start`

#### Environment Variables

Create `backend/.env` (already included):

```env
PORT=5000
NODE_ENV=development
```

---

### 2. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:5173**

> API calls to `/api/*` are automatically proxied to `http://localhost:5000` by Vite — no CORS configuration needed in the browser.

---

### Running Both Together

You need **two terminals** running simultaneously:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Then open: **http://localhost:5173**

---

## API Endpoints

### Quizzes — `/api/quizzes`

| Method | Endpoint           | Description       | Body (required)                        |
|--------|--------------------|-------------------|----------------------------------------|
| GET    | `/api/quizzes`     | Get all quizzes   | —                                      |
| GET    | `/api/quizzes/:id` | Get quiz by ID    | —                                      |
| POST   | `/api/quizzes`     | Create a quiz     | `{ title, questions[] }`               |
| PUT    | `/api/quizzes/:id` | Update a quiz     | `{ title?, description?, questions? }` |
| DELETE | `/api/quizzes/:id` | Delete a quiz     | —                                      |

### Orders — `/api/orders`

| Method | Endpoint       | Description       | Body (required)                         |
|--------|----------------|-------------------|-----------------------------------------|
| GET    | `/api/orders`  | Get all orders    | —                                       |
| POST   | `/api/orders`  | Create an order   | `{ product, quantity (>0), price (≥0) }`|

> `date` is optional on POST — defaults to the current ISO timestamp if omitted.

### Insights — `/api/insights`

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| GET    | `/api/insights` | Get analytics from all orders|

**Response shape:**
```json
{
  "topProducts":    { "Widget A": 15, "Widget B": 7 },
  "busiestHours":  { "9": 3, "14": 5 },
  "recommendations": [
    {
      "product": "Widget A",
      "totalQuantitySold": 15,
      "recommendation": "needs restock"
    }
  ],
  "salesByDay": { "2026-03-18": 22 }
}
```

### Error Response Shape

All errors return a consistent JSON body:

```json
{
  "status": 400,
  "message": "Field \"product\" is required"
}
```

In `development` mode, a `stack` trace is also included.

---

## AI / Data-Driven Insights

The `/api/insights` endpoint implements a lightweight analytics engine in `insightService.js`. No external ML library is used — all logic is pure JavaScript operating on the in-memory orders array.

### How it works

| Insight | Logic |
|---|---|
| **Top Selling Products** | Reduces all orders, summing `quantity` per `product` name. Sorted descending on the frontend. |
| **Busiest Hours** | Extracts the hour (0–23) from each order's `date` using `new Date().getHours()`, counts orders per hour. |
| **Restock Recommendations** | Filters products whose total quantity sold exceeds a configurable threshold (`RESTOCK_THRESHOLD = 10`). Marks them as `"needs restock"`. |
| **Sales by Day** | Groups total quantity sold by ISO date string (`YYYY-MM-DD`), enabling day-level trend analysis. |

### Why it's "ML-like"

While it doesn't use a trained model, the system mirrors the core pipeline of supervised analytics:

1. **Data collection** — orders are recorded with structured fields
2. **Feature extraction** — timestamps → hours/days, product names → categories
3. **Aggregation** — reduce operations produce summary statistics
4. **Decision rules** — threshold-based recommendations act as simple classifiers
5. **Presentation** — results are visualised as bar charts to reveal patterns

This pattern is the foundation of real business intelligence and time-series forecasting systems.

---

## Notes

- Data is stored **in-memory** only — it resets when the server restarts. A database (e.g. MongoDB, PostgreSQL) would be the natural next step.
- The Vite proxy is configured in `frontend/vite.config.js` and requires the backend to be running on port `5000`.
