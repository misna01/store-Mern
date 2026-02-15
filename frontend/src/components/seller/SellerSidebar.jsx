// components/seller/SellerSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiPackage, FiBox, FiUser } from "react-icons/fi";
import { FaSignOutAlt} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/seller";
const LOGOUT = "text-red-500 hover:bg-red-900/50 hover:text-red-400";
const SellerSidebar = () => {
  const { pathname } = useLocation();
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

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-indigo-100 text-indigo-700 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen pt-10 px-4">
      {/* TITLE */}
      <h2 className="text-2xl font-bold text-indigo-700 mb-8">
        Seller Center
      </h2>

      {/* NAV */}
      <nav className="space-y-2">
        <Link to="/seller/dashboard" className={linkClass("/seller/dashboard")}>
          <FiHome /> Dashboard
        </Link>

        <Link to="/seller/orders" className={linkClass("/seller/orders")}>
          <FiPackage /> Orders
        </Link>

        <Link
          to="/seller/manage-products"
          className={linkClass("/seller/manage-products")}
        >
          <FiBox /> Products
        </Link>

<Link
  to="/seller/payments"
  className={linkClass("/seller/payments")}
>
  <FiBox /> Payments
</Link>

        <Link to="/seller/profile" className={linkClass("/seller/profile")}>
          <FiUser /> Profile
        </Link>

           <button
                                            onClick={handleLogout}
                                            className={`w-full mt-6 px-4 py-3 rounded ${LOGOUT}`}
                                          >
                                            <FaSignOutAlt className="inline mr-2" />
                                            Logout
                                          </button>
      </nav>
    </aside>
  );
};

export default SellerSidebar;
