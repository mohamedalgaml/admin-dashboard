import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiActivity, FiUsers, FiCheckCircle, FiBox } from "react-icons/fi";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    users: 0,
    tasks: 0,
    inventory: 0,
    recentTasks: [],
  });

  const fetchDashboardData = async () => {
    try {
      const [usersRes, tasksRes, inventoryRes] = await Promise.all([
        axios.get("http://localhost:3001/users"),
        axios.get("http://localhost:3001/tasks"),
        axios.get("http://localhost:3001/inventory"),
      ]);

      const sortedTasks = [...tasksRes.data].sort(
        (a, b) => b.id - a.id
      ); 

      setCounts({
        users: usersRes.data.length,
        tasks: tasksRes.data.filter((t) => t.status !== "done").length,
        inventory: inventoryRes.data.length,
        recentTasks: sortedTasks.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: counts.users,
      icon: <FiUsers size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Tasks",
      value: counts.tasks,
      icon: <FiCheckCircle size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Inventory Items",
      value: counts.inventory,
      icon: <FiBox size={24} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "System Health",
      value: "Good",
      icon: <FiActivity size={24} />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {counts.recentTasks.length === 0 ? (
              <p>No recent tasks found.</p>
            ) : (
              counts.recentTasks.map((task) => (
                <li key={task.id} className="border-b pb-2 flex justify-between">
                  <span>{task.title}</span>
                  <span className="capitalize text-gray-500">{task.status}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Placeholder for Inventory Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Inventory Status</h2>
          <p className="text-sm text-gray-600">Chart component coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
