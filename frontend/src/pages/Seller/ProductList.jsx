// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../../shared/Navbar";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const token = localStorage.getItem("token");

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/seller/my-products",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setProducts(res.data.products);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to load products");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* TOP NAV */}
//       <Navbar />

//       <div className="flex">

//         {/* FIXED LEFT SIDEBAR */}
//         <div className="w-64 bg-white shadow-md p-6 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
//           <h2 className="text-xl font-bold mb-6">Products</h2>

//           <div className="space-y-3">
//             <a
//               href="/seller/manage-products"
//               className="block p-2 rounded hover:bg-gray-200"
//             >
//               📦 Manage Products
//             </a>

//             <a
//               href="/seller/add-product"
//               className="block p-2 rounded hover:bg-gray-200"
//             >
//               ➕ Add Product
//             </a>

//             <a
//               href="/seller/my-products"
//               className="block p-2 rounded bg-indigo-100 text-indigo-700 font-medium"
//             >
//               📝 Product List
//             </a>
//           </div>
//         </div>

//         {/* RIGHT CONTENT */}
//         <div className="flex-1 ml-64 p-10 mt-16">
//           <h2 className="text-3xl font-bold mb-6">Your Uploaded Products</h2>

//           {products.length === 0 ? (
//             <p>No products found.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {products.map((p) => (
//                 <div
//                   key={p._id}
//                   className="bg-white rounded shadow p-4 border"
//                 >
//                   <img
//                     src={p.images?.[0] || ""}
//                     alt=""
//                     className="h-40 w-full object-cover rounded"
//                   />

//                   <h3 className="font-bold mt-2 text-lg">{p.name}</h3>
//                   <p className="text-gray-600">{p.brand}</p>
//                   <p className="font-semibold text-green-700">₹{p.price}</p>

//                   <button className="mt-3 bg-red-500 text-white px-3 py-1 rounded">
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;
// pages/seller/ProductList.jsx
import SellerLayout from "../../components/seller/SellerLayout";
import axios from "axios";
import { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/seller/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data.products));
  }, []);

  return (
    <SellerLayout>
      <h1 className="text-3xl font-bold mb-6">Your Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img src={p.images?.[0]} className="h-40 w-full object-cover rounded" />
            <h3 className="font-bold mt-2">{p.name}</h3>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </SellerLayout>
  );
};

export default ProductList;
