
// // import React, { useEffect, useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import Swal from "sweetalert2";
// // import Navbar from "../../shared/Navbar";

// // const ManageProducts = () => {
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [search, setSearch] = useState("");
// //   const token = localStorage.getItem("token");
// //   const navigate = useNavigate();

// //   /* =========================
// //      FETCH PRODUCTS
// //      ========================= */
// //   const fetchProducts = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await axios.get(
// //         "http://localhost:5000/api/seller/my-products",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       console.log("Products fetched:", res.data.products);
// //       setProducts(res.data.products || []);
// //     } catch (err) {
// //       console.error("Fetch products error:", err);
// //       Swal.fire("Error", "Failed to fetch products", "error");
// //       setProducts([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* =========================
// //      SEARCH PRODUCTS
// //      ========================= */
// //   const searchProducts = async (value) => {
// //     setSearch(value);
// //     try {
// //       const res = await axios.get(
// //         `http://localhost:5000/api/seller/search-products?q=${value}`,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setProducts(res.data.products || []);
// //     } catch (err) {
// //       console.error("Search error:", err);
// //     }
// //   };

// //   /* =========================
// //      BLOCK / UNBLOCK
// //      ========================= */
// //   const toggleBlockStatus = async (id) => {
// //     try {
// //       const res = await axios.patch(
// //         `http://localhost:5000/api/seller/toggle-status/${id}`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setProducts(res.data.products || []);
// //       Swal.fire("Success", "Status updated", "success");
// //     } catch {
// //       Swal.fire("Error", "Action failed", "error");
// //     }
// //   };

// //   /* =========================
// //      FEATURE / UNFEATURE
// //      ========================= */
// //   const toggleFeature = async (id) => {
// //     try {
// //       const res = await axios.patch(
// //         `http://localhost:5000/api/seller/toggle-feature/${id}`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setProducts(res.data.products || []);
// //     } catch {
// //       Swal.fire("Error", "Failed to update feature", "error");
// //     }
// //   };

// //   /* =========================
// //      ADD OFFER
// //      ========================= */
// //   const handleAddOffer = async (productId) => {
// //     const { value } = await Swal.fire({
// //       title: "Offer percentage",
// //       input: "number",
// //       inputAttributes: { min: 1, max: 90 },
// //       showCancelButton: true,
// //     });

// //     const percentage = Number(value);
// //     if (!percentage || percentage < 1 || percentage > 90) return;

// //     try {
// //       await axios.post(
// //         "http://localhost:5000/api/seller/add-offer",
// //         { productId, percentage },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       Swal.fire("Success", "Offer added", "success");
// //       fetchProducts();
// //     } catch {
// //       Swal.fire("Error", "Failed to add offer", "error");
// //     }
// //   };

// //   /* =========================
// //      REMOVE OFFER
// //      ========================= */
// //   const handleRemoveOffer = async (productId) => {
// //     const confirm = await Swal.fire({
// //       title: "Remove offer?",
// //       showCancelButton: true,
// //       confirmButtonColor: "#d33",
// //     });

// //     if (!confirm.isConfirmed) return;

// //     try {
// //       await axios.post(
// //         "http://localhost:5000/api/seller/remove-offer",
// //         { productId },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       Swal.fire("Removed", "Offer removed", "success");
// //       fetchProducts();
// //     } catch {
// //       Swal.fire("Error", "Failed to remove offer", "error");
// //     }
// //   };

// //   useEffect(() => {
// //     fetchProducts();
// //   }, []);

// //   /* =========================
// //      LOADING / EMPTY STATES
// //      ========================= */
// //   if (loading) return <div className="p-10 text-center">Loading products...</div>;
// //   if (!products || products.length === 0)
// //     return (
// //       <div className="p-10 text-center">
// //         <h2 className="text-xl mb-4">No products found</h2>
// //         <button
// //           onClick={() => navigate("/seller/add-product")}
// //           className="bg-indigo-600 text-white px-4 py-2 rounded"
// //         >
// //           ➕ Add Product
// //         </button>
// //       </div>
// //     );

// //   return (
// //     <div className="min-h-screen">
// //       <Navbar />
// //       {/* HEADER */}
// //       <div className="flex justify-between mb-6">
// //         <h1 className="text-2xl font-bold">Manage Products</h1>
// //         <button
// //           onClick={() => navigate("/seller/add-product")}
// //           className="bg-indigo-600 text-white px-4 py-2 rounded"
// //         >
// //           ➕ Add Product
// //         </button>
// //       </div>

// //       {/* SEARCH */}
// //       <div className="mb-4">
// //         <input
// //           value={search}
// //           onChange={(e) => searchProducts(e.target.value)}
// //           placeholder="Search products..."
// //           className="border rounded-full px-4 py-2 w-72"
// //         />
// //       </div>

// //       {/* PRODUCTS TABLE */}
// //       <div className="bg-white shadow rounded overflow-x-auto">
// //         <table className="w-full">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="p-4 text-left">Product</th>
// //               <th className="p-4">Category</th>
// //               <th className="p-4">Price</th>
// //               <th className="p-4">Stock</th>
// //               <th className="p-4">Offer</th>
// //               <th className="p-4">Status</th>
// //               <th className="p-4">Actions</th>
// //               <th className="p-4">list</th>
// //               <th className="p-4">Brand</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {products.map((p) => (
// //               <tr key={p._id} className="border-t">
// //                 <td className="p-4 flex gap-3 items-center">
// //                   <img
// //                     src={p.images?.[0] || "https://via.placeholder.com/50"}
// //                     className="w-10 h-10 rounded object-cover"
// //                   />
// //                   {p.name}
// //                 </td>

// //                 <td className="p-4 text-center">{p.category}</td>
// //                 <td className="p-4 text-center">₹{p.salePrice || p.price}</td>

// //                 <td className="p-4 text-center">
// //                   {p.quantity > 0 ? `${p.quantity} left` : "Out"}
// //                 </td>

// //                 <td className="p-4 text-center">
// //                   {p.offer ? (
// //                     <button
// //                       onClick={() => handleRemoveOffer(p._id)}
// //                       className="text-orange-600"
// //                     >
// //                       {p.offer}% remove
// //                     </button>
// //                   ) : (
// //                     <button
// //                       onClick={() => handleAddOffer(p._id)}
// //                       className="text-blue-600"
// //                     >
// //                       Add
// //                     </button>
// //                   )}
// //                 </td>

// //                 <td className="p-4 text-center">
// //                   <button
// //                     onClick={() => toggleBlockStatus(p._id)}
// //                     className={`px-3 py-1 rounded text-xs ${
// //                       p.isBlocked
// //                         ? "bg-red-100 text-red-600"
// //                         : "bg-green-100 text-green-600"
// //                     }`}
// //                   >
// //                     {p.isBlocked ? "Blocked" : "Active"}
// //                   </button>
// //                 </td>

// //                 <td className="p-4 text-center space-x-2">
// //                   <Link
// //                     to={`/seller/edit-product/${p._id}`}
// //                     className="text-blue-600"
// //                   >
// //                     Edit
// //                   </Link>
// //                   <button
// //                     onClick={() => toggleFeature(p._id)}
// //                     className={`px-2 py-1 text-xs rounded ${
// //                       p.isFeatured ? "bg-yellow-400" : "bg-gray-300"
// //                     }`}
// //                   >
// //                     {p.isFeatured ? "Featured" : "Feature"}
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ManageProducts;
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Navbar from "../../shared/Navbar";

// const ManageProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   /* =========================
//      FETCH PRODUCTS
//      ========================= */
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/seller/my-products",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to fetch products", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      SEARCH PRODUCTS
//      ========================= */
//   const searchProducts = async (value) => {
//     setSearch(value);
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/seller/search-products?q=${value}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setProducts(res.data.products || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* =========================
//      BLOCK / UNBLOCK
//      ========================= */
//   const toggleBlockStatus = async (id) => {
//     try {
//       const res = await axios.patch(
//         `http://localhost:5000/api/seller/toggle-status/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setProducts(res.data.products || []);
//       Swal.fire("Success", "Status updated", "success");
//     } catch {
//       Swal.fire("Error", "Action failed", "error");
//     }
//   };

//   /* =========================
//      FEATURE / UNFEATURE
//      ========================= */
//   const toggleFeature = async (id) => {
//     try {
//       const res = await axios.patch(
//         `http://localhost:5000/api/seller/toggle-feature/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setProducts(res.data.products || []);
//     } catch {
//       Swal.fire("Error", "Failed to update feature", "error");
//     }
//   };

//   /* =========================
//      LIST / UNLIST  (NEW)
//      ========================= */
//   const toggleListStatus = async (id) => {
//     try {
//       const res = await axios.patch(
//         `http://localhost:5000/api/seller/toggle-list/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setProducts(res.data.products || []);
//       Swal.fire("Success", "List status updated", "success");
//     } catch {
//       Swal.fire("Error", "Failed to update list status", "error");
//     }
//   };

//   /* =========================
//      ADD OFFER
//      ========================= */
//   const handleAddOffer = async (productId) => {
//     const { value } = await Swal.fire({
//       title: "Offer percentage",
//       input: "number",
//       inputAttributes: { min: 1, max: 90 },
//       showCancelButton: true,
//     });

//     const percentage = Number(value);
//     if (!percentage || percentage < 1 || percentage > 90) return;

//     try {
//       await axios.post(
//         "http://localhost:5000/api/seller/add-offer",
//         { productId, percentage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       Swal.fire("Success", "Offer added", "success");
//       fetchProducts();
//     } catch {
//       Swal.fire("Error", "Failed to add offer", "error");
//     }
//   };

//   /* =========================
//      REMOVE OFFER
//      ========================= */
//   const handleRemoveOffer = async (productId) => {
//     const confirm = await Swal.fire({
//       title: "Remove offer?",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       await axios.post(
//         "http://localhost:5000/api/seller/remove-offer",
//         { productId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       Swal.fire("Removed", "Offer removed", "success");
//       fetchProducts();
//     } catch {
//       Swal.fire("Error", "Failed to remove offer", "error");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* =========================
//      LOADING / EMPTY
//      ========================= */
//   if (loading)
//     return <div className="p-10 text-center">Loading products...</div>;

//   if (!products.length)
//     return (
//       <div className="p-10 text-center">
//         <h2 className="text-xl mb-4">No products found</h2>
//         <button
//           onClick={() => navigate("/seller/add-product")}
//           className="bg-indigo-600 text-white px-4 py-2 rounded"
//         >
//           ➕ Add Product
//         </button>
//       </div>
//     );

//   return (
//     <div className="min-h-screen">
//       <Navbar />

//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-bold">Manage Products</h1>
//         <button
//           onClick={() => navigate("/seller/add-product")}
//           className="bg-indigo-600 text-white px-4 py-2 rounded"
//         >
//           ➕ Add Product
//         </button>
//       </div>

//       {/* SEARCH */}
//       <div className="mb-4">
//         <input
//           value={search}
//           onChange={(e) => searchProducts(e.target.value)}
//           placeholder="Search products..."
//           className="border rounded-full px-4 py-2 w-72"
//         />
//       </div>

//       {/* PRODUCTS TABLE */}
//       <div className="bg-white shadow rounded overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-4 text-left">Product</th>
//               <th className="p-4">Category</th>
//               <th className="p-4">Price</th>
//               <th className="p-4">Stock</th>
//               <th className="p-4">Offer</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Feature</th>
//               <th className="p-4">List</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {products.map((p) => (
//               <tr key={p._id} className="border-t">
//                 <td className="p-4 flex gap-3 items-center">
//                   <img
//                     src={p.images?.[0] || "https://via.placeholder.com/50"}
//                     className="w-10 h-10 rounded object-cover"
//                     alt={p.name}
//                   />
//                   {p.name}
//                 </td>

//                 <td className="p-4 text-center">{p.category}</td>

//                 <td className="p-4 text-center">
//                   ₹{p.salePrice || p.regularPrice}
//                 </td>

//                 <td className="p-4 text-center">
//                   {p.quantity > 0 ? `${p.quantity} left` : "Out"}
//                 </td>

//                 <td className="p-4 text-center">
//                   {p.offer > 0 ? (
//                     <button
//                       onClick={() => handleRemoveOffer(p._id)}
//                       className="text-orange-600"
//                     >
//                       {p.offer}% remove
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleAddOffer(p._id)}
//                       className="text-blue-600"
//                     >
//                       Add
//                     </button>
//                   )}
//                 </td>

//                 <td className="p-4 text-center">
//                   <button
//                     onClick={() => toggleBlockStatus(p._id)}
//                     className={`px-3 py-1 rounded text-xs ${
//                       p.isBlocked
//                         ? "bg-red-100 text-red-600"
//                         : "bg-green-100 text-green-600"
//                     }`}
//                   >
//                     {p.isBlocked ? "Blocked" : "Active"}
//                   </button>
//                 </td>

//                 <td className="p-4 text-center">
//                   <button
//                     onClick={() => toggleFeature(p._id)}
//                     className={`px-3 py-1 rounded text-xs ${
//                       p.isFeatured
//                         ? "bg-yellow-400 text-black"
//                         : "bg-gray-300 text-black"
//                     }`}
//                   >
//                     {p.isFeatured ? "Featured" : "Feature"}
//                   </button>
//                 </td>

//                 <td className="p-4 text-center">
//                   <button
//                     onClick={() => toggleListStatus(p._id)}
//                     className={`px-3 py-1 rounded text-xs ${
//                       p.isListed
//                         ? "bg-green-100 text-green-700"
//                         : "bg-gray-200 text-gray-600"
//                     }`}
//                   >
//                     {p.isListed ? "Listed" : "Unlisted"}
//                   </button>
//                 </td>

//                 <td className="p-4 text-center space-x-2">
//                   <Link
//                     to={`/seller/edit-product/${p._id}`}
//                     className="text-blue-600"
//                   >
//                     Edit
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManageProducts;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../shared/Navbar";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* =========================
     FETCH PRODUCTS
     ========================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/seller/my-products",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEARCH PRODUCTS
     ========================= */
  const searchProducts = async (value) => {
    setSearch(value);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/seller/search-products?q=${value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     BLOCK / UNBLOCK
     ========================= */
  const toggleBlockStatus = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/seller/toggle-status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data.products || []);
      Swal.fire("Success", "Status updated", "success");
    } catch {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  /* =========================
     FEATURE / UNFEATURE
     ========================= */
  const toggleFeature = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/seller/toggle-feature/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data.products || []);
    } catch {
      Swal.fire("Error", "Failed to update feature", "error");
    }
  };

  /* =========================
     LIST / UNLIST
     ========================= */
  const toggleListStatus = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/seller/toggle-list/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data.products || []);
      Swal.fire("Success", "List status updated", "success");
    } catch {
      Swal.fire("Error", "Failed to update list status", "error");
    }
  };

  /* =========================
     ADD OFFER
     ========================= */
  const handleAddOffer = async (productId) => {
    const { value } = await Swal.fire({
      title: "Offer percentage",
      input: "number",
      inputAttributes: { min: 1, max: 90 },
      showCancelButton: true,
    });

    const percentage = Number(value);
    if (!percentage || percentage < 1 || percentage > 90) return;

    try {
      await axios.post(
        "http://localhost:5000/api/seller/add-offer",
        { productId, percentage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "Offer added", "success");
      fetchProducts();
    } catch {
      Swal.fire("Error", "Failed to add offer", "error");
    }
  };

  /* =========================
     REMOVE OFFER
     ========================= */
  const handleRemoveOffer = async (productId) => {
    const confirm = await Swal.fire({
      title: "Remove offer?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.post(
        "http://localhost:5000/api/seller/remove-offer",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Removed", "Offer removed", "success");
      fetchProducts();
    } catch {
      Swal.fire("Error", "Failed to remove offer", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     LOADING / EMPTY
     ========================= */
  if (loading)
    return <div className="p-10 text-center">Loading products...</div>;

  if (!products.length)
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl mb-4">No products found</h2>
        <button
          onClick={() => navigate("/seller/add-product")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
      </div>
    );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={() => navigate("/seller/add-product")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => searchProducts(e.target.value)}
          placeholder="Search products..."
          className="border rounded-full px-4 py-2 w-72"
        />
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4">Brand</th> {/* ✅ ADDED */}
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Offer</th>
              <th className="p-4">Status</th>
              <th className="p-4">Feature</th>
              <th className="p-4">List</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-4 flex gap-3 items-center">
                  <img
                    src={p.images?.[0] || "https://via.placeholder.com/50"}
                    className="w-10 h-10 rounded object-cover"
                    alt={p.name}
                  />
                  {p.name}
                </td>

                {/* ✅ BRAND VALUE */}
                <td className="p-4 text-center font-medium">
                  {p.brand || "-"}
                </td>

                <td className="p-4 text-center">{p.category}</td>

                <td className="p-4 text-center">
                  ₹{p.salePrice || p.regularPrice}
                </td>

                <td className="p-4 text-center">
                  {p.quantity > 0 ? `${p.quantity} left` : "Out"}
                </td>

                <td className="p-4 text-center">
                  {p.offer > 0 ? (
                    <button
                      onClick={() => handleRemoveOffer(p._id)}
                      className="text-orange-600"
                    >
                      {p.offer}% remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddOffer(p._id)}
                      className="text-blue-600"
                    >
                      Add
                    </button>
                  )}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleBlockStatus(p._id)}
                    className={`px-3 py-1 rounded text-xs ${
                      p.isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {p.isBlocked ? "Blocked" : "Active"}
                  </button>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleFeature(p._id)}
                    className={`px-3 py-1 rounded text-xs ${
                      p.isFeatured
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {p.isFeatured ? "Featured" : "Feature"}
                  </button>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleListStatus(p._id)}
                    className={`px-3 py-1 rounded text-xs ${
                      p.isListed
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.isListed ? "Listed" : "Unlisted"}
                  </button>
                </td>

                <td className="p-4 text-center space-x-2">
                  <Link
                    to={`/seller/edit-product/${p._id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
