import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // 1️⃣ TRY USER FIRST
      try {
        await axios.post(
          "http://localhost:5000/api/user/forgot-password",
          { email }
        );

        // USER SUCCESS
        navigate("/verify-forgot-otp", { 
          state: { email, role: "user" } 
        });
        return;

      } catch (userErr) {
        // If not 404, real error
        if (userErr.response?.status !== 404) {
          throw userErr;
        }
      }

      // 2️⃣ TRY SELLER IF USER NOT FOUND
      await axios.post(
        "http://localhost:5000/api/seller/forgot-password",
        { email }
      );

      // SELLER SUCCESS
      navigate("/verify-forgot-otp", { 
        state: { email, role: "seller" } 
      });

    } catch (err) {
      setError(
        err.response?.data?.message || 
        "No user or seller account found with this email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
