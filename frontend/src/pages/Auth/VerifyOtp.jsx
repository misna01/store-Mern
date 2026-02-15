import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(300);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const role = location.state?.role || "user"; // 🔥 user | seller

  useEffect(() => {
    if (time === 0) return;
    const timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  const handleVerify = async (e) => {
    e.preventDefault();

    const url =
      role === "seller"
        ? "http://localhost:5000/api/seller/verify-otp"
        : "http://localhost:5000/api/user/verify-otp";

    const res = await axios.post(
      url,
      { email, otp },
      { withCredentials: true }
    );

    // Only user might get token (adjust if seller also has token)
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    if (res.data.seller) {
      localStorage.setItem("seller", JSON.stringify(res.data.seller));
    }
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    alert(`${role} email verified successfully`);

    // Redirect based on role
    if (role === "seller") {
      navigate("/seller/login");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Verify {role} Email OTP
        </h2>

        <p className="text-center text-sm text-gray-600">
          Time left: <span className="font-semibold">{time}s</span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          disabled={time === 0}
          className="w-full bg-black text-white py-2 rounded disabled:bg-gray-400"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
