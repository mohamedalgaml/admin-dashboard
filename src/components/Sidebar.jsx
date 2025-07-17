import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiCheckSquare, FiPackage, FiLogOut, FiMenu } from "react-icons/fi";
import useAuthStore from "../store/auth";
import axios from "axios";

const Sidebar = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState({ users: 0, tasks: 0, inventory: 0 });

  const navItems = [
    { path: "/dashboard", icon: <FiHome size={20} />, label: "Dashboard" },
    { path: "/users", icon: <FiUsers size={20} />, label: "Users", badge: counts.users },
    { path: "/tasks", icon: <FiCheckSquare size={20} />, label: "Tasks", badge: counts.tasks },
    { path: "/inventory", icon: <FiPackage size={20} />, label: "Inventory", badge: counts.inventory },
  ];

  const fetchCounts = async () => {
    try {
      const [usersRes, tasksRes, inventoryRes] = await Promise.all([
        axios.get("http://localhost:3001/users"),
        axios.get("http://localhost:3001/tasks"),
        axios.get("http://localhost:3001/inventory"),
      ]);
      setCounts({
        users: usersRes.data.length,
        tasks: tasksRes.data.length,
        inventory: inventoryRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-indigo-600">
          <FiMenu />
        </button>
      </div>

      {/* Optional user name */}
      {!collapsed && (
        <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
          Welcome, <span className="font-medium">Admin</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
            {!collapsed && item.badge > 0 && (
              <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full p-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiLogOut size={20} className="mr-3" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
