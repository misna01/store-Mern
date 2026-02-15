// protect/AdminLayout.jsx
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <ProtectedAdminRoute>
      <Outlet />
    </ProtectedAdminRoute>
  );
};

export default AdminLayout;
