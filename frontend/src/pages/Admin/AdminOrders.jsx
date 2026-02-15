import React, { useEffect, useState } from "react";
import axios from "axios";

const statusBadge = (status) => {
  const map = {
    "Pending Payment": "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Processing: "bg-purple-100 text-purple-700",
    Shipped: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.orders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 font-semibold">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Order Overview</h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const sellers = [
            ...new Set(order.orderItems.map((i) => i.sellerName)),
          ];

          return (
            <div
              key={order._id}
              className="bg-white shadow rounded-lg border"
            >
              {/* ORDER SUMMARY */}
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpanded(expanded === order._id ? null : order._id)
                }
              >
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>
                  <p className="font-semibold text-sm">
                    {order._id}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="font-medium">
                    {order.userId?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.userId?.email}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="font-semibold">
                    ₹{order.pricing?.finalTotal}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.paymentMethod}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded ${statusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* ORDER DETAILS */}
              {expanded === order._id && (
                <div className="border-t p-4 bg-gray-50">
                  <p className="text-sm font-semibold mb-2">
                    Sellers Involved
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {sellers.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm font-semibold mb-2">
                    Order Items
                  </p>

                  <div className="space-y-2">
                    {order.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white p-3 rounded shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Seller: {item.sellerName}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-right">
                          <p>
                            {item.quantity} × ₹
                            {item.priceAtTimeOfOrder}
                          </p>
                          <p className="font-semibold">
                            ₹{item.total}
                          </p>
                          <span className="text-xs text-gray-500">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
