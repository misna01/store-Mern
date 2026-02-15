import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const authToken = token || localStorage.getItem("token");

  useEffect(() => {
    if (!authToken) {
      console.error("❌ No auth token found");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/orders",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("✅ Orders response:", res.data);

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(
          "❌ Order fetch error:",
          err.response?.data || err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authToken]);

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = o.orderItems || o.items || [];

            return (
              <div
                key={o._id}
                className="bg-gray-900 p-5 rounded-xl border border-gray-700"
              >
                <p className="text-lg font-bold mb-2">
                  Order ID:{" "}
                  <span className="text-yellow-400">
                    {o._id}
                  </span>
                </p>

                <p className="text-gray-300 mb-1">
                  Status:{" "}
                  <span
                    className={
                      o.status === "Delivered"
                        ? "text-green-400"
                        : o.status === "Cancelled"
                        ? "text-red-400"
                        : "text-yellow-300"
                    }
                  >
                    {o.status || "Pending"}
                  </span>
                </p>

                <p className="mb-1">
                  Total:{" "}
                  <span className="font-semibold text-yellow-400">
                    ₹{o.pricing?.finalTotal ?? 0}
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  Ordered On:{" "}
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : "N/A"}
                </p>

                <details className="mt-3">
                  <summary className="cursor-pointer text-gray-300 hover:text-yellow-400">
                    View Items
                  </summary>
                  


                  <div className="mt-2 ml-3 space-y-1">
                    {items.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No items found
                      </p>
                    ) : (
                      items.map((item, idx) => (
                        <p
                          key={item.productId?._id || idx}
                          className="text-gray-400"
                        >
                          {item.name} — {item.quantity} × ₹
                          {item.priceAtTimeOfOrder}
                        </p>
                      ))
                    )}
                  </div>
                </details>
                <Link
  to={`/orders/${o._id}`}
  className="inline-block mt-3 text-sm text-yellow-400 hover:underline"
>
  View Details →
</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
