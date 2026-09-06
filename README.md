<div align="center">
  
# 💸 BudgetBuddy
**Master your money. Track every taka.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-BudgetBuddy-37A175?style=for-the-badge)](https://budget-buddy-production.vercel.app/) <!-- Replace with your actual frontend URL -->
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)

</div>

<br />

## 📖 What is BudgetBuddy?
**BudgetBuddy** is a modern, blazing-fast personal finance tracker designed to help you regain control of your wallet. Say goodbye to messy spreadsheets and hello to a beautiful, intuitive dashboard that visualizes your spending habits in real-time. 

Whether you're trying to hit a monthly savings goal or just want to know where all your money went this month, BudgetBuddy gives you the exact insights you need without the clutter.

---

## 📸 Sneak Peek
*(Replace these placeholder links with actual screenshots of your app!)*

<div align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Dashboard+Screenshot" alt="BudgetBuddy Dashboard" width="800"/>
  <p><i>The main dashboard featuring the 6-month trend chart and category breakdown.</i></p>
</div>

<div align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Dark+Mode+Screenshot" alt="BudgetBuddy Dark Mode" width="800"/>
  <p><i>Seamless Dark Mode for tracking expenses at night.</i></p>
</div>

---

## ✨ Key Features

- 🌙 **Seamless Dark Mode:** A beautiful custom dark theme that respects your eyes at night.
- 🎯 **Monthly Budgeting:** Set a monthly target and watch your live progress bar update as you log expenses.
- 📊 **Visual Analytics:** Interactive Pie charts and Trend graphs that automatically categorize your spending.
- ⚡ **Instant Logging:** A slide-over ledger drawer lets you record expenses in seconds without refreshing the page.
- 🔒 **Secure Auth:** JWT-based authentication with fully encrypted passwords.

---

## 🛠️ Tech Stack

**Frontend:**
- **React (Vite)** - For a lightning-fast user interface.
- **Tailwind CSS** - For responsive, custom styling (featuring the custom "Bottle Green" theme).
- **Chart.js** - For beautiful data visualizations.
- **Lucide React** - For sleek, modern icons.

**Backend:**
- **Node.js & Express.js** - Robust REST API architecture.
- **MongoDB & Mongoose** - NoSQL database for flexible data storage.
- **JWT & bcryptjs** - For secure user sessions and password hashing.

---

## 🚀 Quick Start (Local Setup)

Want to run BudgetBuddy on your own machine? Follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Budget-Buddy.git
cd Budget-Buddy
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Run the backend:
```bash
node server.js
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The app will now be running on `http://localhost:5173`!

---

## ☁️ Deployment

- **Backend** is configured to easily deploy to [Render](https://render.com/). Just set the root directory to `backend`, add your environment variables, and use the start command `npm start`.
- **Frontend** is configured to easily deploy to [Vercel](https://vercel.com/). Set the root directory to `frontend`, add the `VITE_API_URL` environment variable pointing to your Render backend, and deploy!

---

<div align="center">
  <i>Built with ❤️ to make personal finance easy.</i>
</div>
