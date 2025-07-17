import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus, FiPackage } from "react-icons/fi";
import { toast } from "react-hot-toast";

function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3001/inventory");
      setItems(res.data);
    } catch (error) {
      toast.error("Failed to fetch items");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/inventory/${editingId}`, {
          name: form.name,
          quantity: parseInt(form.quantity),
        });
        toast.success("Item updated");
      } else {
        await axios.post("http://localhost:3001/inventory", {
          name: form.name,
          quantity: parseInt(form.quantity),
        });
        toast.success("Item added");
      }

      setForm({ name: "", quantity: "" });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, quantity: item.quantity.toString() });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:3001/inventory/${id}`);
        toast.success("Item deleted");
        fetchItems();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
        <FiPackage className="mr-2" /> Inventory
      </h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="block w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
          className="block w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  <FiEdit className="inline" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
                >
                  <FiTrash2 className="inline" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
