import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/seller";

const SellerPayments = () => {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.summary);
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Payments</h1>

        {/* SUMMARY */}
        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Total Sales</p>
              <h2 className="text-xl font-bold">₹{summary.totalSales}</h2>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Admin Commission</p>
              <h2 className="text-xl font-bold text-red-600">
                ₹{summary.adminCommission}
              </h2>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Seller Earnings</p>
              <h2 className="text-xl font-bold text-green-600">
                ₹{summary.sellerEarnings}
              </h2>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Pending Payout</p>
              <h2 className="text-xl font-bold text-orange-600">
                ₹{summary.pendingPayout}
              </h2>
            </div>
          </div>
        )}

        {/* ORDERS TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Seller Earn</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
               <tr key={o.orderId}>
<td className="p-4 flex items-center gap-3">
 <img
  src={
    o.productImage?.startsWith("http")
      ? o.productImage
      : `http://localhost:5000${o.productImage}`
  }
  alt="product"
  className="w-20 h-20 object-cover rounded-lg border"
/>

  <span className="text-sm">{o.orderId}</span>
</td>

                  <td className="p-4 text-center">₹{o.totalAmount}</td>
                  <td className="p-4 text-center text-red-500">
                    ₹{o.adminCommission}
                  </td>
                  <td className="p-4 text-center text-green-600">
                    ₹{o.sellerAmount}
                  </td>
                  <td className="p-4 text-center">
                    {o.payoutStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default SellerPayments;
