// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Sellers = () => {
//   const [sellers, setSellers] = useState([]);

//   const fetchSellers = async () => {
//     const token = localStorage.getItem("adminToken");
//     const res = await axios.get("http://localhost:5000/api/admin/sellers", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setSellers(res.data.sellers);
//   };

//   useEffect(() => {
//     fetchSellers();
//   }, []);

//   const actionHandler = async (url) => {
//     const token = localStorage.getItem("adminToken");
//     await axios.put(
//       url,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     fetchSellers();
//   };

//   const statusStyle = (status) => {
//     switch (status) {
//       case "APPROVED":
//         return "bg-green-100 text-green-700";
//       case "BLOCKED":
//         return "bg-red-100 text-red-700";
//       case "REJECTED":
//         return "bg-gray-200 text-gray-700";
//       default:
//         return "bg-yellow-100 text-yellow-700";
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="bg-white shadow-lg rounded-xl p-6">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           Seller Management
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200 rounded-lg">
//             <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
//               <tr>
//                 <th className="px-4 py-3 text-left">Store</th>
//                 <th className="px-4 py-3 text-left">Email</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {sellers.map((s) => (
//                 <tr
//                   key={s._id}
//                   className="hover:bg-gray-50 transition"
//                 >
//                   <td className="px-4 py-3 font-medium text-gray-800">
//                     {s.businessName || s.storeName}
//                   </td>

//                   <td className="px-4 py-3 text-gray-600">
//                     {s.email}
//                   </td>

//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle(
//                         s.status
//                       )}`}
//                     >
//                       {s.status}
//                     </span>
//                   </td>

//                   <td className="px-4 py-3 text-center space-x-2">
//                     {s.status === "PENDING" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             actionHandler(
//                               `http://localhost:5000/api/admin/seller/approve/${s._id}`
//                             )
//                           }
//                           className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
//                         >
//                           Approve
//                         </button>

//                         <button
//                           onClick={() =>
//                             actionHandler(
//                               `http://localhost:5000/api/admin/seller/reject/${s._id}`
//                             )
//                           }
//                           className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}

//                     {s.status === "APPROVED" && (
//                       <button
//                         onClick={() =>
//                           actionHandler(
//                             `http://localhost:5000/api/admin/seller/block/${s._id}`
//                           )
//                         }
//                         className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
//                       >
//                         Block
//                       </button>
//                     )}

//                     {s.status === "BLOCKED" && (
//                       <button
//                         onClick={() =>
//                           actionHandler(
//                             `http://localhost:5000/api/admin/seller/block/${s._id}`
//                           )
//                         }
//                         className="px-3 py-1.5 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition"
//                       >
//                         Unblock
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {sellers.length === 0 && (
//             <p className="text-center text-gray-500 py-6">
//               No sellers found
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sellers;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ ADDED

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate(); // ✅ ADDED

  const fetchSellers = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://localhost:5000/api/admin/sellers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSellers(res.data.sellers);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const actionHandler = async (url) => {
    const token = localStorage.getItem("adminToken");
    await axios.put(
      url,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchSellers();
  };

  const statusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "BLOCKED":
        return "bg-red-100 text-red-700";
      case "REJECTED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Seller Management
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {sellers.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {s.businessName || s.storeName}
                  </td>

                  <td className="px-4 py-3 text-gray-600">{s.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle(
                        s.status
                      )}`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    {/* ✅ VIEW BUTTON (ADDED) */}
                    <button
                      onClick={() => navigate(`/admin/sellers/${s._id}`)}
                      className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      View
                    </button>

                    {s.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            actionHandler(
                              `http://localhost:5000/api/admin/seller/approve/${s._id}`
                            )
                          }
                          className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            actionHandler(
                              `http://localhost:5000/api/admin/seller/reject/${s._id}`
                            )
                          }
                          className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {s.status === "APPROVED" && (
                      <button
                        onClick={() =>
                          actionHandler(
                            `http://localhost:5000/api/admin/seller/block/${s._id}`
                          )
                        }
                        className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        Block
                      </button>
                    )}

                    {s.status === "BLOCKED" && (
                      <button
                        onClick={() =>
                          actionHandler(
                            `http://localhost:5000/api/admin/seller/block/${s._id}`
                          )
                        }
                        className="px-3 py-1.5 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sellers.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No sellers found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sellers;
