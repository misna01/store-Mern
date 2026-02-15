import { Navigate } from "react-router-dom";

/**
 * Protects ALL admin pages
 * - Blocks access if adminToken is missing
 * - Redirects to /admin (login)
 */
const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  // ❌ Not logged in as admin
  if (!adminToken) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Admin authenticated
  return children;
};

export default ProtectedAdminRoute;
