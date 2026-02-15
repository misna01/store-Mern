import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Products from "./Products";
import Banners from "./Banners";
import Users from "./Users";
import Sellers from "./Sellers";
import AdminOrders from "./AdminOrders";
import DashboardCards from "./DashboardCards";
import AdminPayments from "./AdminPayments";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 ADMIN AUTH CHECK — THIS IS THE PLACE
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/admin"); // redirect to admin login
      return;
    }

    verifyToken(adminToken);
  }, [navigate]);

  const verifyToken = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid admin token");
      }

      setLoading(false); // ✅ verified admin
    } catch (err) {
      console.error("Admin verification failed:", err);
      localStorage.removeItem("adminToken");
      navigate("/admin");
    }
  };

  // ⏳ Prevent dashboard flash before auth check
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Verifying admin access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 p-8">
        {activeSection === "dashboard" && <DashboardCards />}
        {activeSection === "products" && <Products />}
        {activeSection === "orders" && <AdminOrders />}
        {activeSection === "users managment" && <Users />}
        {activeSection === "sellers managment" && <Sellers />}
        {activeSection === "banners" && <Banners />}
        {activeSection === "payments" && <AdminPayments />}
      </div>
    </div>
  );
};

export default AdminDashboard;
