// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../../shared/Navbar";
// import { FaTrash, FaShoppingCart } from "react-icons/fa";
// import { Loader2 } from "lucide-react";

// const Wishlist = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   // Fetch Wishlist
//   const fetchWishlist = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/user/wishlist", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setItems(res.data.items || []);
//     } catch (err) {
//       console.log("Wishlist fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove item
//   const removeItem = async (productId) => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/user/wishlist/${productId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchWishlist();
//     } catch (err) {
//       console.log("Wishlist remove error:", err);
//     }
//   };

//   // Add to cart
//   const addToCart = async (productId) => {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/user/cart",
//         { productId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       removeItem(productId); // auto remove from wishlist
//     } catch (err) {
//       console.log("Add to cart error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   if (loading)
//     return (
//       <div className="w-full h-screen flex justify-center items-center">
//         <Loader2 className="animate-spin w-8 h-8 text-yellow-500" />
//       </div>
//     );

//   return (
//     <>
//       <Navbar />

//       <div className="max-w-6xl mx-auto px-4 py-10">
//         <h1 className="text-3xl font-bold mb-6">Your Wishlist ❤️</h1>

//         {items.length === 0 ? (
//           <p className="text-gray-500 text-center text-lg mt-10">
//             Your wishlist is empty.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {items.map((item) => (
//               <div
//                 key={item._id}
//                 className="border bg-white rounded-xl shadow hover:shadow-lg transition p-4"
//               >
//                 <img
//                   src={item.productId?.images?.[0]}
//                   alt={item.productId?.name}
//                   className="h-48 w-full object-cover rounded-md"
//                 />

//                 <h2 className="text-lg font-semibold mt-3">
//                   {item.productId?.name}
//                 </h2>

//                 <p className="text-gray-700 font-medium mt-1">
//                   ₹{item.productId?.price}
//                 </p>

//                 {/* Buttons */}
//                 <div className="flex justify-between mt-5">
//                   {/* Remove */}
//                   <button
//                     onClick={() => removeItem(item.productId._id)}
//                     className="p-2 bg-red-500 text-white rounded-full"
//                   >
//                     <FaTrash />
//                   </button>

//                   {/* Add to cart */}
//                   <button
//                     onClick={() => addToCart(item.productId._id)}
//                     className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-300"
//                   >
//                     <FaShoppingCart />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Wishlist;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../shared/Navbar";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// Define the colors for consistency with the premium theme
const GOLD_ACCENT = "text-yellow-500";
const DARK_BG = "bg-gray-950";
const DARK_CONTAINER = "bg-gray-900 border border-gray-800 shadow-2xl shadow-black/50";
const TEXT_LIGHT = "text-white";
const TEXT_MUTED = "text-gray-400";
const BUTTON_PRIMARY = "bg-yellow-500 text-gray-950 hover:bg-yellow-400";
const BUTTON_DELETE = "bg-red-700 text-white hover:bg-red-600";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch Wishlist
  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data.items || []);
    } catch (err) {
      console.log("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  const getProductPrice = (product) => {
    if (!product) return 0;
    return product.salePrice > 0
      ? product.salePrice
      : product.regularPrice;
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/wishlist/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchWishlist();
    } catch (err) {
      console.log("Wishlist remove error:", err);
    }
  };

  // Add to cart
  const addToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/cart/add",
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      removeItem(productId); // auto remove from wishlist
      alert("Product added to cart!");
    } catch (err) {
      console.log("Add to cart error:", err);
      alert("Failed to add product to cart.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading)
    return (
      <div className={`w-full h-screen flex justify-center items-center ${DARK_BG}`}>
        <Loader2 className={`animate-spin w-8 h-8 ${GOLD_ACCENT}`} />
      </div>
    );

  return (
    <div className={`min-h-screen ${DARK_BG} font-sans`}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Wishlist Header */}
        <header className="text-center mb-12">
            <h1 className={`text-5xl font-light ${TEXT_LIGHT} mb-4 tracking-widest uppercase`}>
                <span className={GOLD_ACCENT}>—</span> YOUR MAISON WISHLIST <span className={GOLD_ACCENT}>—</span>
            </h1>
            <p className={`text-xl ${TEXT_MUTED} max-w-3xl mx-auto`}>
                Treasured selections awaiting your consideration.
            </p>
        </header>

        {items.length === 0 ? (
          <p className={`${TEXT_MUTED} text-center text-xl mt-16`}>
            Your wishlist is empty. Discover your next luxury item!
          </p>
        ) : (
          <div className="space-y-6"> {/* Changed from grid to vertical space-y layout */}
            {items.map((item) => (
              <div
                key={item._id}
                className={`flex items-center p-6 rounded-xl transition ${DARK_CONTAINER} hover:border-yellow-500/50`}
              >
                {/* Product Image */}
                <img
                  src={item.productId?.images?.[0]}
                  alt={item.productId?.name}
                  className="h-28 w-28 object-cover rounded-md flex-shrink-0 border border-gray-700"
                />

                {/* Product Details and Actions */}
                <div className="flex-grow ml-6 flex justify-between items-center">
                    <div>
                        <h2 className={`text-xl font-semibold ${TEXT_LIGHT} mb-1`}>
                            {item.productId?.name}
                        </h2>

                        <p className={GOLD_ACCENT}>
                      ₹{getProductPrice(item.productId)}
                    </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 flex-shrink-0">
                      {/* Add to cart */}
                      <button
                        onClick={() => addToCart(item.productId._id)}
                        className={`flex items-center space-x-2 px-5 py-3 rounded-lg uppercase text-sm font-semibold transition ${BUTTON_PRIMARY} shadow-lg`}
                        title="Add to Cart"
                      >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId._id)}
                        className={`p-3 rounded-full transition ${BUTTON_DELETE} shadow-lg`}
                        title="Remove from Wishlist"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;