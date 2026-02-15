// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../../shared/Navbar";
// import { Loader2, ArrowLeft } from "lucide-react";

// const OrderDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [cancelLoading, setCancelLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   // ---------------- FETCH ORDER ----------------
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchOrder = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/user/orders/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (res.data.success) {
//           setOrder(res.data.order);
//         } else {
//           setError("Order not found");
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load order");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [id, token, navigate]);

//   // ---------------- CANCEL ORDER ----------------
//   const handleCancelOrder = async () => {
//     const confirmCancel = window.confirm(
//       "Are you sure you want to cancel this order?"
//     );
//     if (!confirmCancel) return;

//     try {
//       setCancelLoading(true);

//       const res = await axios.put(
//         `http://localhost:5000/api/user/orders/${order._id}/cancel`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setOrder(res.data.order);
//         alert("Order cancelled successfully");
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to cancel order");
//     } finally {
//       setCancelLoading(false);
//     }
//   };

//   // ---------------- LOADING ----------------
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-950">
//         <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
//       </div>
//     );
//   }

//   // ---------------- ERROR ----------------
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-950 text-white">
//         <Navbar />
//         <div className="flex justify-center items-center h-[80vh]">
//           <p className="text-red-500 text-lg">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!order) return null;

//   const canCancel =
//     !["Cancelled", "Shipped", "Delivered"].includes(order.status);

//   return (
//     <div className="min-h-screen bg-gray-950 text-white">
//       <Navbar />

//       <div className="max-w-6xl mx-auto px-4 py-10">
//         {/* ---------------- BACK BUTTON ---------------- */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           Back
//         </button>

//         {/* ---------------- TITLE ---------------- */}
//         <h1 className="text-4xl font-bold text-center mb-10">
//           Order Details
//         </h1>

//         {/* ---------------- ORDER INFO ---------------- */}
//         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
//           <p className="text-gray-400">
//             <span className="font-semibold text-white">Order ID:</span>{" "}
//             {order._id}
//           </p>

//           <p className="text-gray-400">
//             <span className="font-semibold text-white">Status:</span>{" "}
//             <span
//               className={`font-bold ${
//                 order.status === "Cancelled"
//                   ? "text-red-500"
//                   : order.status === "Delivered"
//                   ? "text-green-500"
//                   : "text-yellow-500"
//               }`}
//             >
//               {order.status}
//             </span>
//           </p>

//           <p className="text-gray-400">
//             <span className="font-semibold text-white">
//               Payment Method:
//             </span>{" "}
//             {order.paymentMethod}
//           </p>

//           <p className="text-gray-400">
//             <span className="font-semibold text-white">
//               Ordered On:
//             </span>{" "}
//             {new Date(order.createdAt).toLocaleString()}
//           </p>
//         </div>

//         {/* ---------------- CANCEL BUTTON ---------------- */}
//         {canCancel && (
//           <div className="flex justify-end mb-10">
//             <button
//               onClick={handleCancelOrder}
//               disabled={cancelLoading}
//               className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 transition"
//             >
//               {cancelLoading ? "Cancelling..." : "Cancel Order"}
//             </button>
//           </div>
//         )}

//         {/* ---------------- ORDER ITEMS ---------------- */}
//         <div className="space-y-6">
//           {order.orderItems.map((item, index) => (
//             <div
//               key={index}
//               className="flex gap-6 bg-gray-900 border border-gray-800 rounded-xl p-5"
//             >
//               <img
//                 src={item.image || "/placeholder.png"}
//                 alt={item.name}
//                 className="w-28 h-28 object-cover rounded-lg border border-gray-700"
//               />

//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold">{item.name}</h2>

//                 {item.brand && (
//                   <p className="text-sm text-gray-400">
//                     Brand: {item.brand}
//                   </p>
//                 )}
//                 <p className="text-sm text-gray-400">
//   Sold by:{" "}
//   <span className="text-yellow-500 font-semibold">
//     {item.sellerName}
//   </span>
// </p>


//                 <p className="text-gray-400">
//                   Price: ₹{item.priceAtTimeOfOrder}
//                 </p>
//                 <p className="text-gray-400">
//                   Quantity: {item.quantity}
//                 </p>

//                 <p className="mt-2 font-bold text-yellow-500">
//                   Item Total: ₹{item.total}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ---------------- PRICE SUMMARY ---------------- */}
//         <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-6">
//           <h2 className="text-2xl font-semibold mb-4">
//             Price Summary
//           </h2>

//           <div className="space-y-2 text-gray-400">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{order.pricing.subtotal}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax</span>
//               <span>₹{order.pricing.tax}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery</span>
//               <span>₹{order.pricing.deliveryCharge}</span>
//             </div>

//             <hr className="border-gray-700 my-3" />

//             <div className="flex justify-between text-xl font-bold">
//               <span>Total</span>
//               <span className="text-yellow-500">
//                 ₹{order.pricing.finalTotal}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ---------------- SHIPPING ADDRESS ---------------- */}
//         <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-6">
//           <h2 className="text-2xl font-semibold mb-4">
//             Shipping Address
//           </h2>

//           <p className="text-gray-400">{order.shippingAddress.name}</p>
//           <p className="text-gray-400">{order.shippingAddress.phone}</p>
//           <p className="text-gray-400">
//             {order.shippingAddress.fullAddress}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../shared/Navbar";
import { Loader2, ArrowLeft } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token, navigate]);

  /* ================= CANCEL ORDER ================= */
  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      setCancelLoading(true);

      const res = await axios.put(
        `http://localhost:5000/api/user/orders/${order._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setOrder(res.data.order);
        alert("Order cancelled successfully");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const canCancel =
    !["Cancelled", "Shipped", "Delivered"].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-10">
          Order Details
        </h1>

        {/* ORDER INFO */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-gray-400">
            <span className="font-semibold text-white">Order ID:</span>{" "}
            {order._id}
          </p>

          <p className="text-gray-400">
            <span className="font-semibold text-white">Order Status:</span>{" "}
            <span
              className={`font-bold ${
                order.status === "Cancelled"
                  ? "text-red-500"
                  : order.status === "Delivered"
                  ? "text-green-500"
                  : order.status === "Shipped"
                  ? "text-blue-500"
                  : "text-yellow-500"
              }`}
            >
              {order.status}
            </span>
          </p>

          <p className="text-gray-400">
            <span className="font-semibold text-white">
              Payment Method:
            </span>{" "}
            {order.paymentMethod}
          </p>

          <p className="text-gray-400">
            <span className="font-semibold text-white">
              Ordered On:
            </span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* CANCEL BUTTON */}
        {canCancel && (
          <div className="flex justify-end mb-10">
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 transition"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        )}

        {/* ORDER ITEMS */}
        <div className="space-y-6">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-6 bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg border border-gray-700"
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>

                {item.brand && (
                  <p className="text-sm text-gray-400">
                    Brand: {item.brand}
                  </p>
                )}

                <p className="text-sm text-gray-400">
                  Sold by:{" "}
                  <span className="text-yellow-500 font-semibold">
                    {item.sellerName}
                  </span>
                </p>

                <p className="text-gray-400">
                  Price: ₹{item.priceAtTimeOfOrder}
                </p>

                <p className="text-gray-400">
                  Quantity: {item.quantity}
                </p>

                {/* ✅ ITEM STATUS (UPDATED BY SELLER) */}
                <p className="mt-2 text-sm">
                  <span className="text-gray-400">Item Status: </span>
                  <span
                    className={`font-semibold ${
                      item.status === "Delivered"
                        ? "text-green-500"
                        : item.status === "Shipped"
                        ? "text-blue-500"
                        : item.status === "Packed"
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </p>

                <p className="mt-1 font-bold text-yellow-500">
                  Item Total: ₹{item.total}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PRICE SUMMARY */}
        <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Price Summary
          </h2>

          <div className="space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.pricing.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.pricing.tax}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{order.pricing.deliveryCharge}</span>
            </div>

            <hr className="border-gray-700 my-3" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-yellow-500">
                ₹{order.pricing.finalTotal}
              </span>
            </div>
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Shipping Address
          </h2>

          <p className="text-gray-400">{order.shippingAddress.name}</p>
          <p className="text-gray-400">{order.shippingAddress.phone}</p>
          <p className="text-gray-400">
            {order.shippingAddress.fullAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

