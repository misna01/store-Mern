import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimeCartLogo from '../assets/images/primecart-logo.png'; 

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load logged-in user from localStorage
  useEffect(() => {
  try {
    const saved = localStorage.getItem("user");

    if (!saved || saved === "undefined") {
      setUser(null);
      return;
    }

    setUser(JSON.parse(saved));
  } catch (err) {
    console.error("Failed to load user:", err);
    setUser(null);
  }
}, []);


  // Logout Function (Auto-detect user / seller)
  const handleLogout = async () => {
    try {
      if (user?.role === "user") {
        await fetch("http://localhost:5000/api/user/logout", {
          method: "POST",
          credentials: "include",
        });
      }

      if (user?.role === "seller") {
        await fetch("http://localhost:5000/api/seller/logout", {
          method: "POST",
          credentials: "include",
        });
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 return (
    <header className="backdrop-blur-lg bg-white/40 sticky top-0 z-50 rounded-b-3xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        {/* LOGO - UPDATED TO USE IMAGE */}
        <div
          className="cursor-pointer" // Make the whole logo area clickable
          onClick={() => navigate("/")}
        >
          <img 
            src={PrimeCartLogo} // Use the imported image file
            alt="PrimeCart Logo" 
            className="h-16 md:h-12" // Adjust size as needed, 'h-10' is a good starting point
          />
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-4">

          {/* CART */}
          <Link to="/cart">
            <button className="bg-primary text-white px-3 py-2 rounded-full hover:bg-primary/90 transition">
              🛒
            </button>
          </Link>

          {/* WISHLIST (Only User) */}
          {user?.role === "user" ? (
            <Link to="/wishlist">
              <button className="text-red-500 text-xl hover:scale-110 transition">♥</button>
            </Link>
          ) : (
            // A common pattern is to show a disabled button or a link to login/register for the action
            <button
              onClick={() => alert("Please log in as a user to view your wishlist.")}
              className="text-red-500 text-xl hover:scale-110 transition opacity-75" // Added opacity for visual difference
              title="Only users can view wishlist." // Added title for better UX
            >
              ♥
            </button>
          )}

          {/* PROFILE ICONS & LOGOUT */}
          {user ? ( // Use a single block for authenticated state
            <>
              {/* USER PROFILE ICON */}
              {user.role === "user" && (
                <Link to="/user/profile">
                  <button 
                    className="text-xl border border-gray-700 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-800 hover:text-white transition"
                    title="User Profile"
                  >
                    👤
                  </button>
                </Link>
              )}

              {/* SELLER PROFILE ICON */}
              {user.role === "seller" && (
                <Link to="/seller/dashboard">
                  <button 
                    className="text-xl border border-gray-700 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-800 hover:text-white transition"
                    title="Seller Dashboard"
                  >
                    🧑‍💼
                  </button>
                </Link>
              )}

              {/* LOGOUT */}
              {/* <button
                onClick={handleLogout}
                className="border border-gray-700 text-gray-700 px-3 py-2 rounded-full hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button> */}
            </>
          ) : (
            // LOGIN BUTTONS (If not logged in) - This section is clean and correct
            <>
              <Link to="/login">
                <button className="border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-800 hover:text-white transition">
                  Login
                </button>
              </Link>

              {/* <Link to="/seller/login">
                <button className="border border-gray-700 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-800 hover:text-white transition">
                  Seller Login
                </button>
              </Link> */}
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;