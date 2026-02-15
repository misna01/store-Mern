import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const API_URL = "http://localhost:5000/api/user";

const Wallet = ({ token }) => {
  const [wallet, setWallet] = useState({
    balance: 0,
    history: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchWallet = async () => {
      try {
        const res = await axios.get(`${API_URL}/wallet`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWallet({
          balance: res.data.wallet?.balance ?? 0,
          history: res.data.wallet?.history ?? [],
        });
      } catch (err) {
        setError("Failed to load wallet");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [token]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin w-8 h-8 text-yellow-500" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="p-6 text-red-400 bg-red-900/30 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Wallet Balance
      </h2>

      <div className="text-3xl font-extrabold text-yellow-500 mb-6">
        ₹{wallet.balance.toFixed(2)}
      </div>

      <h3 className="text-lg mb-3 font-semibold">
        Wallet History
      </h3>

      {wallet.history.length === 0 ? (
        <p className="text-gray-400">No wallet transactions yet</p>
      ) : (
        <div className="space-y-3">
          {wallet.history.map((item, index) => (
            <div
              key={index}
              className="flex justify-between bg-gray-800 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {item.description || "Transaction"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>

              <div
                className={`font-bold ${
                  item.type === "CREDIT"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {item.type === "CREDIT" ? "+" : "-"}₹{item.amount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wallet;
