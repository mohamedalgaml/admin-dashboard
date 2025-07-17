import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import useAuthStore from "./store/auth";

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {isAuthenticated && <Sidebar />}
        <div className={`flex-1 transition-all duration-300 ${isAuthenticated ? "ml-64" : "ml-0"}`}>
          <main className="p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              {isAuthenticated ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}