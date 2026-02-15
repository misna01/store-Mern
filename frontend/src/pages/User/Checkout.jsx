



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPin } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Navbar from "../../shared/Navbar";
import Swal from "sweetalert2";

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const API = "http://localhost:5000/api/user";

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);

  /* ================= PRICE FIX (SAME AS CART) ================= */
  const getProductPrice = (product) => {
    if (!product) return 0;
    return product.salePrice > 0
      ? product.salePrice
      : product.regularPrice;
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const addrRes = await fetch(`${API}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        }); 
        const addrData = await addrRes.json();
        setAddresses(addrData.addresses || []);
        if (addrData.addresses?.length) {
          setSelectedAddress(addrData.addresses[0]._id);
        }

        const cartRes = await fetch(`${API}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartRes.json();
        setCartItems(cartData.cart?.items || []);
      } catch (err) {
        console.error("Checkout load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= TOTAL CALCULATION (MATCH CART) ================= */
  const subtotal = cartItems.reduce((total, item) => {
    return (
      total +
      getProductPrice(item.productId) * item.quantity
    );
  }, 0);

  const shipping = cartItems.length > 0 ? 50 : 0;
  const tax = subtotal * 0.05;
  const finalTotal = subtotal + shipping + tax;

  const usdAmount = (finalTotal / 83).toFixed(2);

  /* ================= CREATE ORDER ================= */
  const createOrder = async (method, paypalId = null) => {
    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        selectedAddress,
        paymentMethod: method,
        paypalOrderId: paypalId,
      }),
    });
    return res.json();
  };

  const handlePlaceOrder = async () => {
    const data = await createOrder(paymentMethod);
    if (data.success) {
      navigate(`/order-success?orderId=${data.orderId}`);
    } else {
      Swal.fire("Order Failed", data.message || "Try again", "error");
    }
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-yellow-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* ADDRESS */}
          <div className="bg-gray-900 p-6 rounded border border-gray-700">
            <h2 className="text-xl mb-4 flex gap-2">
              <MapPin className="text-yellow-500" /> Shipping Address
            </h2>

            {addresses.map((a) => (
              <div
                key={a._id}
                onClick={() => setSelectedAddress(a._id)}
                className={`p-4 mb-3 rounded cursor-pointer border ${
                  selectedAddress === a._id
                    ? "border-yellow-500 bg-gray-800"
                    : "border-gray-700"
                }`}
              >
                <p className="font-semibold">{a.name}</p>
                <p className="text-gray-400">
                  {a.landmark}, {a.city}, {a.state}
                </p>
                <p>{a.phone}</p>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-gray-900 p-6 rounded border border-gray-700">
            <h2 className="text-xl mb-4">Order Summary</h2>

            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-4 mb-4">
                <img
                  src={item.productId?.images?.[0]}
                  alt={item.productId?.name}
                  className="w-24 h-24 rounded object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {item.productId?.name}
                  </p>
                  <p className="text-gray-400">
                    ₹{getProductPrice(item.productId)} ×{" "}
                    {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-gray-900 p-6 rounded border border-gray-700">
          <h2 className="text-xl mb-4">Payment</h2>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Wallet">Wallet</option>
            <option value="PayPal">PayPal</option>
          </select>

          <div className="mt-4 text-gray-300 space-y-1">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Shipping: ₹{shipping}</p>
            <p>Tax (5%): ₹{tax.toFixed(2)}</p>
            <p className="text-yellow-500 font-bold">
              Total: ₹{finalTotal.toFixed(2)}
            </p>
          </div>

          {paymentMethod !== "PayPal" && (
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-yellow-500 text-black py-3 rounded font-bold"
            >
              Place Order
            </button>
          )}

          {paymentMethod === "PayPal" && (
            <div className="mt-6">
              <PayPalButtons
                forceReRender={[usdAmount]}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      {
                        amount: { value: usdAmount },
                      },
                    ],
                  })
                }
                onApprove={(data, actions) =>
                  actions.order.capture().then(async () => {
                    const res = await createOrder(
                      "PayPal",
                      data.orderID
                    );

                    if (res.success) {
                      Swal.fire(
                        "Success 🎉",
                        "Payment completed",
                        "success"
                      ).then(() =>
                        navigate(
                          `/order-success?orderId=${res.orderId}`
                        )
                      );
                    }
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
