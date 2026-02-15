import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const role = state?.role || "user"; // Get role from state

  useEffect(() => {
    if (!state?.email) {
      navigate(role === "seller" ? "/seller/forgot-password" : "/forgot-password");
      return;
    }
  }, [state, navigate, role]);

  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Role-based URL
      const url =
        role === "seller"
          ? "http://localhost:5000/api/seller/reset-password"
          : "http://localhost:5000/api/user/reset-password";

      const res = await axios.post(url, {
        email: state.email,
        password
      });

      alert(res.data.message || "Password reset successful");

      // Role-based navigation
      const loginRoute = role === "seller" ? "/login" : "/login";
      navigate(loginRoute);
    } catch (err) {
      const message = err.response?.data?.message || "Password reset failed";
      setError(message);
      console.error("Password Reset Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Reset {role === "seller" ? "Seller" : "User"} Password
        </h2>

        <p className="text-sm text-gray-600 text-center">
          For: <strong>{state?.email}</strong>
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded pr-10"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded"
          required
          disabled={loading}
        />

        {password && confirmPassword && (
          <div className="text-sm">
            {password === confirmPassword ? (
              <p className="text-green-600">✓ Passwords match</p>
            ) : (
              <p className="text-red-600">✗ Passwords do not match</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:bg-gray-400 font-semibold transition"
          disabled={loading || !password || !confirmPassword || password !== confirmPassword}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate(role === "seller" ? "/seller/login" : "/login")}
            className="text-blue-600 hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;