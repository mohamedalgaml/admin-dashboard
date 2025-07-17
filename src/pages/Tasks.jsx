import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus, FiCheck, FiClock, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    description: "",
    status: "todo", 
    priority: "medium",
    dueDate: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:3001/tasks");
      setTasks(res.data);
      applyFilters(res.data, filterStatus);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (tasksList, status) => {
    if (status === "all") {
      setFilteredTasks(tasksList);
    } else {
      setFilteredTasks(tasksList.filter(task => task.status === status));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingId) {
        await axios.put(`http://localhost:3001/tasks/${editingId}`, form);
        toast.success("Task updated successfully");
      } else {
        await axios.post("http://localhost:3001/tasks", form);
        toast.success("Task added successfully");
      }
      setForm({ 
        title: "", 
        description: "",
        status: "todo", 
        priority: "medium",
        dueDate: ""
      });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority || "medium",
      dueDate: task.dueDate || ""
    });
    setEditingId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:3001/tasks/${id}`);
        toast.success("Task deleted successfully");
        fetchTasks();
      } catch (error) {
        toast.error("Failed to delete task");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
      toast.success("Task status updated");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    applyFilters(tasks, status);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo":
        return <FiAlertCircle className="mr-1" />;
      case "in-progress":
        return <FiClock className="mr-1" />;
      case "done":
        return <FiCheck className="mr-1" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1 rounded-lg text-sm ${filterStatus === "all" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("todo")}
            className={`px-3 py-1 rounded-lg text-sm flex items-center ${filterStatus === "todo" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {filterStatus === "todo" && <FiAlertCircle className="mr-1" />}
            To Do
          </button>
          <button
            onClick={() => handleFilterChange("in-progress")}
            className={`px-3 py-1 rounded-lg text-sm flex items-center ${filterStatus === "in-progress" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {filterStatus === "in-progress" && <FiClock className="mr-1" />}
            In Progress
          </button>
          <button
            onClick={() => handleFilterChange("done")}
            className={`px-3 py-1 rounded-lg text-sm flex items-center ${filterStatus === "done" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {filterStatus === "done" && <FiCheck className="mr-1" />}
            Done
          </button>
        </div>
      </div>

      {/* Add/Edit Task Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h2 className="text-lg font-medium mb-4">
          {editingId ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ 
                    title: "", 
                    description: "",
                    status: "todo", 
                    priority: "medium",
                    dueDate: ""
                  });
                }}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white ${
                isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {editingId ? (
                    <FiEdit className="mr-2" />
                  ) : (
                    <FiPlus className="mr-2" />
                  )}
                  {editingId ? "Update Task" : "Add Task"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tasks List */}
      <div className="overflow-x-auto">
        {isLoading && !filteredTasks.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filterStatus === "all" ? "No tasks found" : `No ${filterStatus.replace("-", " ")} tasks`}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center mt-3 space-x-3">
                      <span className={`flex items-center text-sm ${
                        task.status === "todo" 
                          ? "text-red-600" 
                          : task.status === "in-progress" 
                            ? "text-yellow-600" 
                            : "text-green-600"
                      }`}>
                        {getStatusIcon(task.status)}
                        {task.status.replace("-", " ")}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  {task.status !== "todo" && (
                    <button
                      onClick={() => handleStatusChange(task.id, "todo")}
                      className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Mark as To Do
                    </button>
                  )}
                  {task.status !== "in-progress" && (
                    <button
                      onClick={() => handleStatusChange(task.id, "in-progress")}
                      className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      Mark as In Progress
                    </button>
                  )}
                  {task.status !== "done" && (
                    <button
                      onClick={() => handleStatusChange(task.id, "done")}
                      className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                    >
                      Mark as Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}