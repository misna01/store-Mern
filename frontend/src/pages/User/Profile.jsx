import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import axios from "axios";
import Wallet from "./Wallet";
import { useNavigate } from "react-router-dom";


import {
  FaUser,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";

import MyAddresses from "./MyAddresses";
import Orders from "./Orders";

const GOLD = "text-yellow-500";
const DARK_BG = "bg-gray-950";
const CARD = "bg-gray-900 border border-gray-800 shadow-2xl shadow-black/50";
const TEXT = "text-white";
const MUTED = "text-gray-400";
const INPUT =
  "bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500";
const BTN = "bg-yellow-500 text-gray-950 hover:bg-yellow-400";
const BTN_DISABLED = "bg-gray-700 text-gray-500 cursor-not-allowed";
const LOGOUT = "text-red-500 hover:bg-red-900/50 hover:text-red-400";

const API_URL = "http://localhost:5000/api/user";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("account");
  const [authToken, setAuthToken] = useState(null);

  // Fetch user profile from backend
 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login", { replace: true });
    return;
  }

  setAuthToken(token);
  fetchUserProfile(token);
}, []);


  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // update localStorage
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: "", type: "" });

    if (!authToken) {
      setStatus({ message: "Authentication token missing.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      };

      const res = await axios.post(`${API_URL}/update-profile`, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const updated = res.data.user;

      // Update state and localStorage
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      setStatus({ message: "Profile updated successfully!", type: "success" });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Update failed.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API failed");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  /* ================= MENU ================= */
  const menu = [
    { key: "orders", name: "Orders", icon: <FaBoxOpen /> },
    { key: "addresses", name: "My Addresses", icon: <FaMapMarkerAlt /> },
    { key: "account", name: "Account Details", icon: <FaUser /> },
    { key: "wallet", name: "Wallet", icon: <FaHeart /> },
  ];

  /* ================= RENDER SECTION ================= */
  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <Orders token={authToken} />;

      case "addresses":
        return (
          <div className={`rounded-xl overflow-hidden ${CARD}`}>
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className={`text-2xl font-light ${TEXT}`}>
                <span className={GOLD}>My</span> Addresses
              </h2>
            </div>
            <MyAddresses token={authToken} />
          </div>
        );

      case "wallet":
        return <Wallet token={authToken} />;

      case "account":
      default:
        return (
          <div className={`rounded-xl overflow-hidden ${CARD}`}>
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className={`text-2xl font-light ${TEXT}`}>
                <span className={GOLD}>Account</span> Details
              </h2>
            </div>

            <div className="p-6">
              {status.message && (
                <div
                  className={`p-3 mb-4 rounded ${
                    status.type === "error"
                      ? "bg-red-900 text-red-300 border border-red-700"
                      : "bg-green-900 text-green-300 border border-green-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className={`block mb-2 ${MUTED}`}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg ${INPUT}`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${MUTED}`}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg ${INPUT}`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${MUTED}`}>Email</label>
                  <input
                    value={user.email}
                    disabled
                    className="w-full p-3 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${MUTED}`}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg ${INPUT}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-md font-bold ${
                    loading ? BTN_DISABLED : BTN
                  }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-6 h-6 inline-block mr-2" />
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </form>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${DARK_BG}`}>
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR */}
          <div className="w-full md:w-1/4">
            <div className={`rounded-xl p-6 ${CARD}`}>
              <div className="text-center border-b border-gray-700 pb-4 mb-4">
                <div className={`inline-block p-4 rounded-full bg-gray-800 ${GOLD}`}>
                  <FaUser className="text-3xl" />
                </div>
                <p className={`text-lg font-bold ${TEXT}`}>{user.firstName || "User"}</p>
                <p className={`text-sm ${MUTED}`}>{user.email}</p>
              </div>

              <ul className="space-y-2">
                {menu.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveSection(item.key)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                        activeSection === item.key
                          ? "bg-yellow-500 text-gray-900 font-bold"
                          : "text-gray-400 hover:bg-gray-800 hover:text-yellow-400"
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleLogout}
                className={`w-full mt-6 px-4 py-3 rounded ${LOGOUT}`}
              >
                <FaSignOutAlt className="inline mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
