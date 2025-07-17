# 🛠️ Admin Dashboard

A responsive and modern admin dashboard built with **React**, **Vite**, and **Tailwind CSS**. This application provides pages for managing users, tasks, and inventory items, along with authentication and toast notifications.

## 🚀 Features

- 🔐 Login and logout with Zustand-based auth state
- 📊 Dashboard overview with key statistics
- 👥 User management (list only, extendable)
- ✅ Task management section
- 📦 Full inventory CRUD with:
  - Add / Edit / Delete items
  - Search and category filtering
  - Stock status (in stock / low stock / out of stock)
- 🔔 Toast notifications using `react-hot-toast`
- 🌈 Responsive and clean UI using TailwindCSS

---

## 🧪 Tech Stack

| Technology        | Role                          |
|------------------|-------------------------------|
| React            | Frontend framework            |
| Vite             | Fast development environment  |
| Tailwind CSS     | Styling and layout            |
| Zustand          | State management (auth)       |
| Axios            | HTTP requests                 |
| React Router DOM | Routing between pages         |
| React Icons      | Icon library                  |
| React Hot Toast  | Notifications UI              |

---

## 📁 Project Structure

admin-dashboard/
├── public/
│ └── index.html
├── src/
│ ├── components/
│ │ └── Sidebar.jsx
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Inventory.jsx
│ │ ├── Login.jsx
│ │ ├── Tasks.jsx
│ │ └── Users.jsx
│ ├── store/
│ │ └── auth.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── vite.config.js
├── postcss.config.js
└── package.json

---

## ⚙️ Getting Started

### 1. Clone the repository
⚙️ Getting Started
1. Clone the Repository
bash
git clone https://github.com/mohamedalgaml/admin-dashboard.git
cd admin-dashboard
2. Install Dependencies
bash
npm install
3. Run the Development Server
bash
npm run dev
4. Run the Mock API Server (in another terminal)
bash
npm run server
🔧 Configuration
Tailwind CSS - Configured in tailwind.config.js

PostCSS - Setup in postcss.config.js

Vite - Optimized build configuration in vite.config.js

