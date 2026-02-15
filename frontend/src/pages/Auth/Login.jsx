import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // ================= EMAIL & PASSWORD VALIDATION =================
  const validate = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;

    // ---------- EMAIL VALIDATION ----------
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!email.includes("@")) {
      newErrors.email = "Email must contain @ symbol";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email (example@gmail.com)";
        isValid = false;
      }
    }

    // ---------- PASSWORD VALIDATION ----------
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.includes(" ")) {
      newErrors.password = "Password should not contain spaces";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return; // 🚫 STOP here if validation fails

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "user") {
        localStorage.setItem(
          "user",
          JSON.stringify({ role: "user", ...res.data.user })
        );
      }

      if (res.data.role === "seller") {
        localStorage.setItem(
          "user",
          JSON.stringify({ role: "seller", ...res.data.seller })
        );
      }

      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-200 to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* EMAIL */}
          <div>
            <input
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 
                ${errors.email ? "border-red-500" : "border-gray-300"}
                focus:ring-pink-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 
                ${errors.password ? "border-red-500" : "border-gray-300"}
                focus:ring-pink-400`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
          >
            Login
          </button>
        </form>

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-right mt-2 text-pink-600 cursor-pointer hover:underline"
        >
          Forgot password?
        </p>

        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}

        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-pink-600 font-semibold cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
