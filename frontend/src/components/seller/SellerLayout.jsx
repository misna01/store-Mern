import React from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
