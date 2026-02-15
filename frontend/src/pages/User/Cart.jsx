

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../../shared/Navbar";
// import { useNavigate } from "react-router-dom";
// import { FaTrash } from "react-icons/fa";
// import { Loader2 } from "lucide-react";

// /* ================= THEME ================= */
// const GOLD_ACCENT = "text-yellow-500";
// const DARK_BG = "bg-gray-950";
// const DARK_CONTAINER =
//   "bg-gray-900 border border-gray-800 shadow-2xl shadow-black/50";
// const TEXT_LIGHT = "text-white";
// const TEXT_MUTED = "text-gray-400";
// const BUTTON_PRIMARY =
//   "bg-yellow-500 text-gray-950 hover:bg-yellow-400";
// const BUTTON_SECONDARY =
//   "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700";
// const BUTTON_DELETE =
//   "bg-red-700 text-white hover:bg-red-600";
// const QUANTITY_BUTTON = "px-3 py-1 rounded-lg transition duration-300";

// /* ================= COMPONENT ================= */
// const Cart = () => {
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [authReady, setAuthReady] = useState(false);

//   /* 🔐 SAFE AUTH READER */
//   const getAuth = () => {
//     try {
//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user"));
//       return { token, role: user?.role };
//     } catch {
//       return { token: null, role: null };
//     }
//   };

//   /* 🔗 ROLE BASED API */
//   const getCartAPI = (role) =>
//     role === "seller"
//       ? "http://localhost:5000/api/seller/cart"
//       : "http://localhost:5000/api/user/cart";

//   /* ================= FETCH CART ================= */
//   const fetchCart = async () => {
//     const { token, role } = getAuth();

//     if (!token || !role) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.get(getCartAPI(role), {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setCartItems(res.data.cart?.items || []);
//     } catch (err) {
//       console.error("Fetch cart error:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= REMOVE ================= */
//   const removeItem = async (productId) => {
//     const { token, role } = getAuth();
//     if (!token) return;

//     await axios.delete(`${getCartAPI(role)}/${productId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     fetchCart();
//   };

//   /* ================= INCREMENT ================= */
//   const incrementQty = async (productId) => {
//     const { token, role } = getAuth();
//     if (!token) return;

//     await axios.put(
//       `${getCartAPI(role)}/increment/${productId}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchCart();
//   };

//   /* ================= DECREMENT ================= */
//   const decrementQty = async (productId) => {
//     const { token, role } = getAuth();
//     if (!token) return;

//     await axios.put(
//       `${getCartAPI(role)}/decrement/${productId}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchCart();
//   };

//   /* ================= TOTAL ================= */
//   const subtotal = cartItems.reduce(
//     (acc, item) =>
//       acc + (item.productId?.price || 0) * item.quantity,
//     0
//   );

//   const shipping = 50;
//   const tax = subtotal * 0.05;
//   const totalPrice = subtotal + shipping + tax;

//   /* ================= AUTH SYNC FIX ================= */
//   useEffect(() => {
//     // Delay until localStorage is fully updated after login switch
//     const timer = setTimeout(() => {
//       setAuthReady(true);
//     }, 200);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (authReady) fetchCart();
//   }, [authReady]);

//   /* ================= LOADER ================= */
//   if (loading)
//     return (
//       <div className={`w-full h-screen flex justify-center items-center ${DARK_BG}`}>
//         <Loader2 className={`animate-spin w-8 h-8 ${GOLD_ACCENT}`} />
//       </div>
//     );

//   /* ================= UI ================= */
//   return (
//     <div className={`min-h-screen ${DARK_BG}`}>
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <h1 className={`text-4xl text-center mb-12 ${TEXT_LIGHT}`}>
//           <span className={GOLD_ACCENT}>—</span> YOUR CART{" "}
//           <span className={GOLD_ACCENT}>—</span>
//         </h1>

//         {cartItems.length === 0 ? (
//           <p className={`${TEXT_MUTED} text-center text-xl`}>
//             Your cart is empty
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//             {/* ITEMS */}
//             <div className="lg:col-span-2 space-y-6">
//               {cartItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className={`flex p-6 rounded-xl ${DARK_CONTAINER}`}
//                 >
//                   <img
//                     src={item.productId?.images?.[0]}
//                     alt=""
//                     className="w-28 h-28 object-cover rounded-md"
//                   />

//                   <div className="flex-grow ml-6">
//                     <h2 className={`text-xl ${TEXT_LIGHT}`}>
//                       {item.productId?.name}
//                     </h2>

//                     <p className={`${GOLD_ACCENT}`}>
//                       ₹{item.productId?.price}
//                     </p>

//                     <div className="flex items-center gap-3 mt-4">
//                       <button
//                         onClick={() => decrementQty(item.productId._id)}
//                         className={`${BUTTON_SECONDARY} ${QUANTITY_BUTTON}`}
//                       >
//                         -
//                       </button>

//                       <span className={TEXT_LIGHT}>{item.quantity}</span>

//                       <button
//                         onClick={() => incrementQty(item.productId._id)}
//                         className={`${BUTTON_SECONDARY} ${QUANTITY_BUTTON}`}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => removeItem(item.productId._id)}
//                     className={`${BUTTON_DELETE} p-3 rounded-full`}
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {/* SUMMARY */}
//             <div className={`p-8 rounded-xl ${DARK_CONTAINER}`}>
//               <p className={TEXT_MUTED}>Subtotal: ₹{subtotal}</p>
//               <p className={TEXT_MUTED}>Shipping: ₹{shipping}</p>
//               <p className={TEXT_MUTED}>Tax: ₹{tax.toFixed(2)}</p>

//               <p className={`text-2xl mt-4 ${TEXT_LIGHT}`}>
//                 Total:{" "}
//                 <span className={GOLD_ACCENT}>
//                   ₹{totalPrice.toFixed(2)}
//                 </span>
//               </p>

//               <button
//                 onClick={() => navigate("/checkout")}
//                 className={`mt-6 w-full ${BUTTON_PRIMARY} py-3 rounded-lg`}
//               >
//                 Checkout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;


import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../shared/Navbar";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { Loader2 } from "lucide-react";

/* ================= THEME ================= */
const GOLD_ACCENT = "text-yellow-500";
const DARK_BG = "bg-gray-950";
const DARK_CONTAINER =
  "bg-gray-900 border border-gray-800 shadow-2xl shadow-black/50";
const TEXT_LIGHT = "text-white";
const TEXT_MUTED = "text-gray-400";
const BUTTON_PRIMARY =
  "bg-yellow-500 text-gray-950 hover:bg-yellow-400";
const BUTTON_SECONDARY =
  "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700";
const BUTTON_DELETE =
  "bg-red-700 text-white hover:bg-red-600";
const QUANTITY_BUTTON = "px-3 py-1 rounded-lg transition duration-300";

/* ================= COMPONENT ================= */
const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH ================= */
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= PRICE FIX (IMPORTANT) ================= */
  const getProductPrice = (product) => {
    if (!product) return 0;
    return product.salePrice > 0
      ? product.salePrice
      : product.regularPrice;
  };

  /* ================= API ================= */
  const CART_API =
    user?.role === "seller"
      ? "http://localhost:5000/api/seller/cart"
      : "http://localhost:5000/api/user/cart";

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const res = await axios.get(CART_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(res.data.cart?.items || []);
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (productId) => {
    await axios.delete(`${CART_API}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  };

  /* ================= INCREMENT ================= */
  const incrementQty = async (productId) => {
    await axios.put(
      `${CART_API}/increment/${productId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart();
  };

  /* ================= DECREMENT ================= */
  const decrementQty = async (productId) => {
    await axios.put(
      `${CART_API}/decrement/${productId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart();
  };

  /* ================= TOTAL CALCULATION ================= */
  const subtotal = cartItems.reduce((total, item) => {
    return (
      total +
      getProductPrice(item.productId) * item.quantity
    );
  }, 0);

  const shipping = cartItems.length > 0 ? 50 : 0;
  const tax = subtotal * 0.05;
  const totalPrice = subtotal + shipping + tax;

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (token) fetchCart();
    else setLoading(false);
  }, []);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${DARK_BG}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${GOLD_ACCENT}`} />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className={`min-h-screen ${DARK_BG}`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className={`text-4xl text-center mb-12 ${TEXT_LIGHT}`}>
          <span className={GOLD_ACCENT}>—</span> YOUR CART{" "}
          <span className={GOLD_ACCENT}>—</span>
        </h1>

        {cartItems.length === 0 ? (
          <p className={`${TEXT_MUTED} text-center text-xl`}>
            Your cart is empty
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* ================= ITEMS ================= */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`flex p-6 rounded-xl ${DARK_CONTAINER}`}
                >
                  <img
                    src={item.productId?.images?.[0]}
                    alt={item.productId?.name}
                    className="w-28 h-28 object-cover rounded-md"
                  />

                  <div className="flex-grow ml-6">
                    <h2 className={`text-xl ${TEXT_LIGHT}`}>
                      {item.productId?.name}
                    </h2>

                    <p className={GOLD_ACCENT}>
                      ₹{getProductPrice(item.productId)}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          decrementQty(item.productId._id)
                        }
                        className={`${BUTTON_SECONDARY} ${QUANTITY_BUTTON}`}
                      >
                        -
                      </button>

                      <span className={TEXT_LIGHT}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          incrementQty(item.productId._id)
                        }
                        className={`${BUTTON_SECONDARY} ${QUANTITY_BUTTON}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(item.productId._id)
                    }
                    className={`${BUTTON_DELETE} p-3 rounded-full`}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* ================= SUMMARY ================= */}
            <div className={`p-8 rounded-xl ${DARK_CONTAINER}`}>
              <p className={TEXT_MUTED}>Subtotal: ₹{subtotal}</p>
              <p className={TEXT_MUTED}>Shipping: ₹{shipping}</p>
              <p className={TEXT_MUTED}>
                Tax: ₹{tax.toFixed(2)}
              </p>

              <p className={`text-2xl mt-4 ${TEXT_LIGHT}`}>
                Total:{" "}
                <span className={GOLD_ACCENT}>
                  ₹{totalPrice.toFixed(2)}
                </span>
              </p>

              <button
                onClick={() => navigate("/checkout")}
                className={`mt-6 w-full ${BUTTON_PRIMARY} py-3 rounded-lg`}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
