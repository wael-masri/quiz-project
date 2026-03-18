# Quiz App — Full Stack Project

A full-stack quiz application built with **Node.js/Express** (backend) and **React/Vite** (frontend).

---

## Project Structure

```
quiz-project/
├── backend/          # Express REST API (port 5000)
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   ├── .env
│   └── package.json
├── frontend/         # React + Vite app (port 5173)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
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

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs at **http://localhost:5000**

> For production: `npm start`

#### API Endpoints

| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | /api/quizzes        | Get all quizzes     |
| GET    | /api/quizzes/:id    | Get quiz by ID      |
| POST   | /api/quizzes        | Create a new quiz   |
| PUT    | /api/quizzes/:id    | Update a quiz       |
| DELETE | /api/quizzes/:id    | Delete a quiz       |

---

### Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:5173**

> API calls are proxied through Vite to `http://localhost:5000` automatically.

---

## Running Both Apps

You need **two terminals** running simultaneously:

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

Then open your browser at **http://localhost:5173**

---

## Environment Variables

The backend reads from `backend/.env`:

```env
PORT=5000
NODE_ENV=development
```
