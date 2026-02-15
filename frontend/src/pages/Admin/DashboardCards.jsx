import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardCards = ({ onSelect }) => {
  const [counts, setCounts] = useState({ users: 0, sellers: 0, orders: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard-counts",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCounts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounts();
  }, []);

  const cardStyle =
    "bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className={cardStyle} onClick={() => onSelect("users")}>
        <h3 className="text-lg font-semibold">Users</h3>
        <p className="text-2xl mt-2">{counts.users}</p>
      </div>

      <div className={cardStyle} onClick={() => onSelect("sellers")}>
        <h3 className="text-lg font-semibold">Sellers</h3>
        <p className="text-2xl mt-2">{counts.sellers}</p>
      </div>

      <div className={cardStyle} onClick={() => onSelect("orders")}>
        <h3 className="text-lg font-semibold">Orders</h3>
        <p className="text-2xl mt-2">{counts.orders}</p>
      </div>
    </div>
  );
};

export default DashboardCards;
