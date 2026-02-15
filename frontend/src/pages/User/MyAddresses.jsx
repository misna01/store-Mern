
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/user";

const MyAddresses = ({ token }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    if (!token) return;
    const res = await axios.get(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(res.data.addresses);
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const handleChange = (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingAddress(null);
    setFormData({
      name: "",
      phone: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      isDefault: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingAddress;
    const url = isEdit
      ? `${API_URL}/addresses/${editingAddress._id}`
      : `${API_URL}/addresses`;

    await axios[isEdit ? "put" : "post"](url, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    resetForm();
    fetchAddresses();
  };

  const startEdit = (a) => {
    setEditingAddress(a);
    setFormData({ ...a });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete address?")) return;
    await axios.delete(`${API_URL}/addresses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
  };

  /* ================= FORM ================= */
  if (isAdding || editingAddress) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["name", "Full Name"],
            ["phone", "Phone Number"],
            ["landmark", "House / Street / Landmark"],
            ["city", "City"],
            ["state", "State"],
            ["pincode", "Pincode"],
            ["country", "Country"],
          ].map(([key, label]) => (
            <input
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={label}
              required
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}

          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="accent-indigo-500"
            />
            Set as default address
          </label>

          <div className="flex gap-4 pt-4">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
              {editingAddress ? "Update Address" : "Save Address"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 border border-slate-600 text-slate-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ================= LIST ================= */
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Add
        </button>
      </div>

      {loading && (
        <p className="text-center text-slate-400">Loading addresses...</p>
      )}

      {!loading && addresses.length === 0 && (
        <div className="text-center text-slate-400 py-10 border border-dashed border-slate-700 rounded-xl">
          <FaMapMarkerAlt className="mx-auto text-4xl mb-3" />
          No saved addresses
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((a) => (
          <div
            key={a._id}
            className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-indigo-500 transition"
          >
            <div className="flex justify-between">
              <div>
                {a.isDefault && (
                  <span className="inline-block mb-2 text-xs bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded">
                    DEFAULT
                  </span>
                )}

                <p className="text-lg font-semibold text-slate-100">
                  {a.name}
                </p>
                <p className="text-sm text-slate-400">📞 {a.phone}</p>

                <p className="text-slate-300 mt-2">
                  {a.landmark}, {a.city}, {a.state} - {a.pincode}
                </p>
                <p className="text-slate-400">{a.country}</p>
              </div>

              <div className="flex gap-3 text-lg">
                <button
                  onClick={() => startEdit(a)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAddresses;
