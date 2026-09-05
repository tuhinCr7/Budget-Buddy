# BudgetBuddy

BudgetBuddy is a full-stack expense tracker web application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to track their expenses, visualize their spending habits, and manage monthly budgets.

## Features

- **User Authentication**: Secure JWT-based signup, login, and protected routes. Passwords hashed with bcrypt.
- **Expense Management**: Complete CRUD operations for expenses. Sort by date and filter by category or date range.
- **Interactive Dashboard**:
  - Pie chart showing spending breakdown by category (Chart.js)
  - Bar chart showing 6-month spending trend (Chart.js)
  - Budget progress bar (Green/Yellow/Red) indicating spend vs budget target.
- **Responsive UI**: Styled with Tailwind CSS for mobile and desktop support.

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS, Chart.js (react-chartjs-2)
- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt
- **Database**: MongoDB (Atlas)

## Project Structure

```
budgetbuddy/
├── backend/            # Express Server API
│   ├── config/         # DB config
│   ├── middleware/     # JWT Auth middleware
│   ├── models/         # Mongoose Schemas (User, Expense)
│   ├── routes/         # Express routes (auth, expenses, user)
│   └── server.js       # Entry point
└── frontend/           # React Vite App
    ├── src/
    │   ├── api/        # Axios client with interceptors
    │   ├── components/ # Reusable UI components & Charts
    │   ├── context/    # Global Auth State
    │   ├── pages/      # Route Pages
    │   ├── App.jsx     # Main Router
    │   └── main.jsx    # React Entry
    ├── tailwind.config.js
    └── vercel.json     # Vercel SPA deployment config
```

## Setup Instructions (Local Development)

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder using `.env.example` as a template:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/budgetbuddy?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```
Start the server:
```bash
npm run dev # or node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Start the React development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`. Ensure the backend is running on port 5000 so the Axios client (`baseURL: 'http://localhost:5000/api'`) connects correctly.

## API Documentation

### Auth Routes (`/api/auth`)
- `POST /signup`: Register a new user (Body: `name`, `email`, `password`)
- `POST /login`: Authenticate user (Body: `email`, `password`)
- `GET /me`: Get logged-in user profile (Header: `Authorization: Bearer <token>`)

### Expense Routes (`/api/expenses`) - *Protected*
- `GET /`: Get all expenses (Query params: `category`, `startDate`, `endDate`)
- `POST /`: Add expense (Body: `amount`, `category`, `date`, `description`)
- `PUT /:id`: Edit expense
- `DELETE /:id`: Delete expense
- `GET /summary`: Get aggregated data for dashboard charts

### User Routes (`/api/user`) - *Protected*
- `PUT /budget`: Set monthly budget (Body: `monthlyBudget`)

## Deployment Guide

### Database
1. Create a cluster on **MongoDB Atlas**.
2. Add your deployment IPs to the Network Access whitelist (or allow all `0.0.0.0/0`).
3. Get the connection string.

### Backend (Render / Heroku)
1. Push your code to GitHub.
2. Connect your repo to **Render** and create a new "Web Service".
3. Set the Root Directory to `backend`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`).

### Frontend (Vercel)
1. In `frontend/src/api/axiosClient.js`, update the `baseURL` to point to your live Render backend URL.
2. Connect your repo to **Vercel**.
3. Set the Root Directory to `frontend`.
4. The `vercel.json` file is already included to handle React Router SPA routing on refresh.
5. Deploy!

## Future Improvements

- Add OAuth login (Google/GitHub).
- Implement recurring expenses (subscriptions).
- Add support for multiple currencies.
- Export expenses to CSV/PDF.
- Add user profile picture uploads.

