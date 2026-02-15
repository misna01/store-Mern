import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyForgotOtp = () => {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(300);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const role = state?.role || "user"; // Get role from state

  useEffect(() => {
    if (!state?.email) {
      navigate(role === "seller" ? "/seller/forgot-password" : "/forgot-password");
      return;
    }
  }, [state, navigate, role]);

  useEffect(() => {
    if (time === 0) return;
    const timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Role-based URL
      const url =
        role === "seller"
          ? "http://localhost:5000/api/seller/verify-forgot-otp"
          : "http://localhost:5000/api/user/verify-forgot-otp";

      const res = await axios.post(url, {
        email: state.email,
        otp: otp.trim()
      });

      alert(res.data.message || "OTP verified successfully");
      
      // Role-based navigation
      const resetPasswordRoute = 
        role === "seller" 
          ? "/reset-password" 
          : "/reset-password";
      
      navigate(resetPasswordRoute, { 
        state: { email: state.email, role } 
      });
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP";
      setError(message);
      console.error("OTP Verification Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      
      const url =
        role === "seller"
          ? "http://localhost:5000/api/seller/forgot-password"
          : "http://localhost:5000/api/user/forgot-password";

      await axios.post(url, { email: state.email });
      
      setTime(300); // Reset timer
      alert("New OTP sent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4 font-bold text-center">
          Verify {role === "seller" ? "Seller" : "User"} OTP
        </h2>
        
        <p className="text-sm text-gray-600 mb-4 text-center">
          OTP sent to: <strong>{state?.email}</strong>
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 text-center">
          <p className="text-gray-600">
            Time left: <span className="font-bold text-lg">{formatTime(time)}</span>
          </p>
        </div>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit OTP"
          className="w-full border border-gray-300 p-3 rounded mb-4 text-center text-lg tracking-widest"
          maxLength={6}
          required
          disabled={loading || time === 0}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
          disabled={loading || time === 0 || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {time === 0 && (
          <div className="mt-4 text-center">
            <p className="text-red-500 mb-2">OTP expired!</p>
            <button
              type="button"
              onClick={resendOtp}
              className="text-blue-600 hover:underline font-semibold"
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
        )}

        {time > 0 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={resendOtp}
              className="text-blue-600 hover:underline text-sm"
              disabled={loading}
            >
              Didn't receive? Resend OTP
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default VerifyForgotOtp;