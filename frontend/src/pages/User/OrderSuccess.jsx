import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const orderId = new URLSearchParams(search).get("orderId");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/user/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading your order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-xl">
        Order not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="bg-green-50 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-green-600">
          🎉 Order Placed Successfully
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Order ID: <span className="font-medium">{order._id}</span>
        </p>
        <p className="text-sm text-gray-600">
          Status: <span className="font-medium">{order.status}</span>
        </p>
        <p className="text-sm text-gray-600">
          Payment Method:{" "}
          <span className="font-medium">{order.paymentMethod}</span>
        </p>

        {/* ✅ CONTINUE SHOPPING BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Continue Shopping →
        </button>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
        <p className="font-medium">{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.fullAddress}</p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>

      {/* ORDER ITEMS */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>

        <div className="space-y-4">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-center border-b pb-4"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="h-24 w-24 object-cover rounded border"
              />

              <div className="flex-1">
                <p className="font-medium text-lg">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Brand: {item.brand || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ₹{item.priceAtTimeOfOrder.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="font-semibold text-indigo-600">
                ₹{item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICE SUMMARY */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Price Summary</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.pricing.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{order.pricing.tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>₹{order.pricing.deliveryCharge.toFixed(2)}</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-indigo-600">
              ₹{order.pricing.finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
