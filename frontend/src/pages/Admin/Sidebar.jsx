// Sidebar.jsx
import React from "react";

const Sidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <ul className="flex-1 p-4 space-y-2">
        <li
          onClick={() => setActiveSection("dashboard")}
          className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
            activeSection === "dashboard" ? "bg-gray-700" : ""
          }`}
        >
          Dashboard
        </li>

        <li
          onClick={() => setActiveSection("products")}
          className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
            activeSection === "products" ? "bg-gray-700" : ""
          }`}
        >
          Products
        </li>

        <li
          onClick={() => setActiveSection("orders")}
          className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
            activeSection === "orders" ? "bg-gray-700" : ""
          }`}
        >
          Orders
        </li>

        <li
          onClick={() => setActiveSection("users managment")}
          className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
            activeSection === "users managment" ? "bg-gray-700" : ""
          }`}
        >
          Users Management
        </li>

        <li
          onClick={() => setActiveSection("sellers managment")}
          className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
            activeSection === "sellers managment" ? "bg-gray-700" : ""
          }`}
        >
          Sellers Management
        </li>

        <li
          onClick={() => setActiveSection("banners")}
          className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
            activeSection === "banners" ? "bg-gray-700" : ""
          }`}
        >
          Banners
        </li>

        <li
          onClick={() => setActiveSection("payments")}
          className={`cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
            activeSection === "payments" ? "bg-gray-700" : ""
          }`}
        >
          Payments
        </li>
      </ul>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin";
          }}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;