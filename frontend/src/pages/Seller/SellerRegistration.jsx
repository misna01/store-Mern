import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerRegistration = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    sellerType: "",
    businessName: "",
    businessAddress: "",
    pinCode: "",
    city: "",
    state: "",
    gst: "",
    pan: "",
    bankAccount: "",
    ifsc: "",
    storeName: "",
  });

  const [documents, setDocuments] = useState({
    panCard: null,
    gstCertificate: null,
    brandCertificate: null,
    addressProof: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    Object.keys(documents).forEach((key) => {
      if (documents[key]) data.append(key, documents[key]);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/seller/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      // Save seller
      localStorage.setItem(
        "user",
        JSON.stringify({ role: "seller", ...res.data.seller })
      );

      localStorage.setItem("token", res.data.token);

      alert("Seller registered successfully!");
      navigate("/");
    } catch (err) {
      console.error("REG ERROR:", err);
      alert("Error submitting seller registration.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ChronoHub Seller Registration
        </h1>

        {/* FIXED: ADDED encType */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Account Details */}
          <h2 className="text-xl font-semibold">Account Information</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="input"
            required
          />

          <h2 className="text-xl font-semibold mt-6">Seller Type</h2>
          <select
            name="sellerType"
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Seller Type</option>
            <option value="Individual">Individual</option>
            <option value="Proprietorship">Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="Private Limited Company">
              Private Limited Company
            </option>
            <option value="Brand Owner">Brand Owner</option>
            <option value="Authorized Reseller">Authorized Reseller</option>
          </select>

          <h2 className="text-xl font-semibold mt-6">Business Information</h2>

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            onChange={handleChange}
            className="input"
            required
          />

          <textarea
            name="businessAddress"
            placeholder="Business Address"
            onChange={handleChange}
            className="input"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="pinCode"
              placeholder="PIN Code"
              onChange={handleChange}
              className="input"
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <input
            type="text"
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="text"
            name="gst"
            placeholder="GST Number (Optional)"
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="pan"
            placeholder="PAN Number"
            onChange={handleChange}
            className="input"
            required
          />

          <h2 className="text-xl font-semibold mt-6">Bank Details</h2>

          <input
            type="text"
            name="bankAccount"
            placeholder="Bank Account Number"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="text"
            name="ifsc"
            placeholder="IFSC Code"
            onChange={handleChange}
            className="input"
            required
          />

          <h2 className="text-xl font-semibold mt-6">Store Setup</h2>

          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            onChange={handleChange}
            className="input"
            required
          />

          <h2 className="text-xl font-semibold mt-6">Upload Documents</h2>

          <label className="block font-medium">PAN Card</label>
          <input
            type="file"
            name="panCard"
            onChange={handleFileChange}
            className="input"
            required
          />

          <label className="block font-medium">GST Certificate (Optional)</label>
          <input
            type="file"
            name="gstCertificate"
            onChange={handleFileChange}
            className="input"
          />

          <label className="block font-medium">
            Brand Authorization Certificate (Optional)
          </label>
          <input
            type="file"
            name="brandCertificate"
            onChange={handleFileChange}
            className="input"
          />

          <label className="block font-medium">Address Proof</label>
          <input
            type="file"
            name="addressProof"
            onChange={handleFileChange}
            className="input"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 mt-6 rounded-lg hover:bg-gray-800 transition"
          >
            Register as Seller
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;
