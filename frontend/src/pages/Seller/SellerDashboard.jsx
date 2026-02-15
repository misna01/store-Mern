import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { MdOutlineInventory } from "react-icons/md";
import axios from "axios";
import Navbar from "../../shared/Navbar";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/seller/dashboard";

const SellerDashboard = () => {
  const navigate = useNavigate();

  // ✅ Hooks MUST be at top (no conditions)
  const [stats, setStats] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH FUNCTIONS ================= */

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/seller/notifications/count",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/seller/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/seller/notifications/read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= HANDLERS ================= */

  const handleBellClick = async () => {
    setShowNotifications((prev) => !prev);
    await fetchNotifications();
    await markAllAsRead();
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUnreadCount();
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats(res.data.dashboard))
      .catch((err) => console.error(err));
  }, [token]);

  /* ================= JSX ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ⏳ Loading UI (NO early return) */}
      {!stats ? (
        <p className="p-6 text-gray-600">Loading dashboard...</p>
      ) : (
        <>
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center mb-6 border-b pb-3 px-6">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

            <div className="relative">
              <FiBell
                onClick={handleBellClick}
                className="text-2xl text-gray-700 cursor-pointer hover:text-black"
              />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className="px-4 py-3 border-b hover:bg-gray-50"
                        >
                          <p className="font-medium text-gray-800">{n.title}</p>
                          <p className="text-sm text-gray-600">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-6">
            <Card title="Today's Sales" value={`₹${stats.todaysSales}`} />
            <Card title="Total Orders" value={stats.totalOrders} />
            <Card title="Revenue" value={`₹${stats.totalRevenue}`} />
            <Card title="Products" value={stats.totalProducts} />
          </div>

          {/* ================= ORDERS ================= */}
          <div className="bg-white p-6 rounded-xl shadow mb-8 mx-6">
            <h3 className="text-xl font-semibold mb-4">Orders Summary</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex justify-between">
                <span>Pending Orders</span>
                <strong>{stats.pendingOrders}</strong>
              </li>
              <li className="flex justify-between">
                <span>Delivered Orders</span>
                <strong>{stats.deliveredOrders}</strong>
              </li>
            </ul>
          </div>

          {/* ================= INVENTORY ================= */}
          <div className="bg-white p-6 rounded-xl shadow mx-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MdOutlineInventory /> Inventory Alerts
            </h3>
            <p className="text-gray-700">⚠ Stock tracking coming soon</p>
          </div>
        </>
      )}
    </div>
  );
};

/* ================= CARD ================= */

const Card = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow text-center hover:shadow-lg transition">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-2 text-gray-800">{value}</p>
  </div>
);

export default SellerDashboard;
