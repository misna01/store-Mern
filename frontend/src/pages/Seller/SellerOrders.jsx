import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../shared/Navbar";

const API_ORDERS = "http://localhost:5000/api/seller/seller-orders";
const API_UPDATE_STATUS = "http://localhost:5000/api/seller/order";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  /* ================= FETCH SELLER ORDERS ================= */
  const fetchSellerOrders = async () => {
    try {
      const res = await axios.get(API_ORDERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ITEM STATUS ================= */
  const updateItemStatus = async (orderId, productId, status) => {
    try {
      await axios.put(
        `${API_UPDATE_STATUS}/${orderId}/item/${productId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI instantly
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? {
                ...order,
                orderItems: order.orderItems.map(item =>
                  item.productId === productId
                    ? { ...item, status }
                    : item
                ),
              }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold mb-6">Seller Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found</p>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow p-6"
              >
                {/* ================= ORDER HEADER ================= */}
                <div className="flex flex-wrap justify-between gap-4 border-b pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">{order._id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p className="font-semibold">{order.paymentMethod}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order Total</p>
                    <p className="font-semibold">
                      ₹{order.pricing?.finalTotal}
                    </p>
                  </div>
                </div>

                {/* ================= SHIPPING ADDRESS ================= */}
                <div className="mb-6 text-sm text-gray-600">
                  <b>Ship To:</b>{" "}
                  {order.shippingAddress?.name},{" "}
                  {order.shippingAddress?.fullAddress}
                </div>

                {/* ================= ORDER ITEMS ================= */}
                <div className="space-y-4">
                  {order.orderItems.map(item => (
                    <div
                      key={item.productId}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-lg p-4"
                    >
                      {/* LEFT: IMAGE + DETAILS */}
                      <div className="flex gap-4 items-center">
                       <img
  src={
    item.image?.startsWith("http")
      ? item.image
      : `http://localhost:5000${item.image}`
  }
  alt={item.name}
  className="w-20 h-20 object-cover rounded-lg"
/>



                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: ₹{item.priceAtTimeOfOrder}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status:{" "}
                            <span className="font-medium">
                              {item.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* RIGHT: STATUS UPDATE */}
                      <div>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateItemStatus(
                              order._id,
                              item.productId,
                              e.target.value
                            )
                          }
                          className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SellerOrders;
