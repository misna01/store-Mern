import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const AdminPayments = () => {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchAdminPayments();
  }, []);

  const fetchAdminPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSummary(res.data.summary);
      setPayments(res.data.payments);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsPaid = async (orderId, sellerId) => {
    try {
      await axios.put(
        `${API_URL}/payments/mark-paid`,
        { orderId, sellerId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchAdminPayments();
      alert("Seller payout marked as PAID");
    } catch (err) {
      console.error(err);
      alert("Failed to mark payout");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Payments</h1>

      {/* SUMMARY */}
      {summary && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Total Admin Commission</p>
            <h2 className="text-xl font-bold text-green-600">
              ₹{summary.totalAdminCommission}
            </h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Total Seller Payable</p>
            <h2 className="text-xl font-bold text-orange-600">
              ₹{summary.totalSellerPayable}
            </h2>
          </div>
        </div>
      )}

      {/* PAYMENTS TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Seller</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Commission</th>
              <th className="p-4">Seller Pay</th>
              <th className="p-4">Payout</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, idx) => (
              <tr key={idx} className="border-t">
  <td className="p-4 text-sm">{p.orderId}</td>
  <td className="p-4">{p.sellerName}</td>

  <td className="p-4 text-center">₹{p.totalAmount}</td>

  <td className="p-4 text-center text-red-500">
    ₹{p.commission}
  </td>

  <td className="p-4 text-center text-green-600">
    ₹{p.sellerAmount}
  </td>

  <td className="p-4 text-center">
    {p.payoutStatus === "Paid" ? (
      <span className="text-green-600 font-semibold">Paid</span>
    ) : (
      <span className="text-orange-600 font-semibold">Pending</span>
    )}
  </td>

  <td className="p-4 text-center">
    {p.payoutStatus === "Pending" && (
      <button
        onClick={() => markAsPaid(p.orderId, p.sellerId)}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Mark Paid
      </button>
    )}
  </td>
</tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
