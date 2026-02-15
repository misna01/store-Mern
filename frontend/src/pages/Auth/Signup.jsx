// // import React, { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // const Signup = () => {
// //   const navigate = useNavigate();
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //   });
// //   const [message, setMessage] = useState("");

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       await axios.post(
// //         "http://localhost:5000/api/user/register",
// //         formData,
// //         { withCredentials: true } // 🔥 IMPORTANT
// //       );

// //       setMessage("OTP sent to your email!");

// //       // Pass email safely using React Router state
// //       navigate("/verify-otp", { state: { email: formData.email } });

// //     } catch (err) {
// //       setMessage("❌ " + (err.response?.data?.message || "Signup failed"));
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //       <div className="bg-white p-8 shadow rounded w-full max-w-md">
// //         <h2 className="text-xl font-bold mb-4">Create Account</h2>

// //         <form onSubmit={handleSubmit} className="space-y-3">
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Full Name"
// //             value={formData.name}
// //             onChange={handleChange}
// //             className="w-full border p-2 rounded"
// //             required
// //           />

// //           <input
// //             type="email"
// //             name="email"
// //             placeholder="Email Address"
// //             value={formData.email}
// //             onChange={handleChange}
// //             className="w-full border p-2 rounded"
// //             required
// //           />

// //           <input
// //             type="password"
// //             name="password"
// //             placeholder="Password"
// //             value={formData.password}
// //             onChange={handleChange}
// //             className="w-full border p-2 rounded"
// //             required
// //           />

// //           <button
// //             type="submit"
// //             className="w-full bg-black text-white py-2 rounded"
// //           >
// //             Sign Up
// //           </button>
// //         </form>

// //         {message && <p className="mt-3 text-center">{message}</p>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// // Assume Tailwind CSS classes like 'input' are defined globally or via utility props

// const RegistrationPage = () => {
//   const navigate = useNavigate();
//   const [isSeller, setIsSeller] = useState(false); // State to toggle between forms
//   const [message, setMessage] = useState("");

//   // --- CUSTOMER SIGNUP STATE ---
//   const [customerFormData, setCustomerFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   // --- SELLER REGISTRATION STATE ---
//   const [sellerForm, setSellerForm] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     sellerType: "",
//     businessName: "",
//     businessAddress: "",
//     pinCode: "",
//     city: "",
//     state: "",
//     gst: "",
//     pan: "",
//     bankAccount: "",
//     ifsc: "",
//     storeName: "",
//   });

//   const [documents, setDocuments] = useState({
//     panCard: null,
//     gstCertificate: null,
//     brandCertificate: null,
//     addressProof: null,
//   });

//   // --- HANDLERS ---
//   const handleCustomerChange = (e) => {
//     setCustomerFormData({ ...customerFormData, [e.target.name]: e.target.value });
//     setMessage("");
//   };

//   const handleSellerChange = (e) => {
//     setSellerForm({ ...sellerForm, [e.target.name]: e.target.value });
//     setMessage("");
//   };

//   const handleFileChange = (e) => {
//     setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
//   };

//   const handleCustomerSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "http://localhost:5000/api/user/register",
//         customerFormData,
//         { withCredentials: true }
//       );
//       setMessage("✅ OTP sent to your email! Redirecting to verification...");
//       navigate("/verify-otp", { state: { email: customerFormData.email } });
//     } catch (err) {
//       setMessage("❌ " + (err.response?.data?.message || "Customer Signup failed"));
//     }
//   };

//   const handleSellerSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     Object.keys(sellerForm).forEach((key) => data.append(key, sellerForm[key]));
//     Object.keys(documents).forEach((key) => {
//       if (documents[key]) data.append(key, documents[key]);
//     });

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/seller/register",
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );

//       localStorage.setItem(
//         "user",
//         JSON.stringify({ role: "seller", ...res.data.seller })
//       );
//       localStorage.setItem("token", res.data.token);
      
//       setMessage("✅ Seller registered successfully!");
//       navigate("/");
//     } catch (err) {
//       console.error("REG ERROR:", err);
//       setMessage("❌ Error submitting seller registration.");
//     }
//   };

//   // --- RENDER FUNCTIONS ---
//   const renderCustomerForm = () => (
//     <div className="bg-white p-8 shadow rounded w-full max-w-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Customer Sign Up</h2>
//       <form onSubmit={handleCustomerSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={customerFormData.name}
//           onChange={handleCustomerChange}
//           className="w-full border p-3 rounded input"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={customerFormData.email}
//           onChange={handleCustomerChange}
//           className="w-full border p-3 rounded input"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={customerFormData.password}
//           onChange={handleCustomerChange}
//           className="w-full border p-3 rounded input"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
//         >
//           Sign Up as Customer
//         </button>
//       </form>
//     </div>
//   );

//   const renderSellerForm = () => (
//     <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         ChronoHub Seller Registration
//       </h1>
//       <form
//         onSubmit={handleSellerSubmit}
//         className="space-y-4"
//         encType="multipart/form-data"
//       >
//         {/* Account Details */}
//         <h2 className="text-xl font-semibold border-b pb-2">Account Information</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <input type="text" name="fullName" placeholder="Full Name" onChange={handleSellerChange} className="input" required />
//           <input type="email" name="email" placeholder="Email" onChange={handleSellerChange} className="input" required />
//           <input type="text" name="phone" placeholder="Phone Number" onChange={handleSellerChange} className="input" required />
//           <input type="password" name="password" placeholder="Password" onChange={handleSellerChange} className="input" required />
//         </div>

//         {/* Seller Type */}
//         <h2 className="text-xl font-semibold border-b pb-2 pt-4">Seller Type</h2>
//         <select name="sellerType" onChange={handleSellerChange} className="input" required>
//           <option value="">Select Seller Type</option>
//           <option value="Individual">Individual</option>
//           <option value="Proprietorship">Proprietorship</option>
//           <option value="Partnership">Partnership</option>
//           <option value="Private Limited Company">Private Limited Company</option>
//           <option value="Brand Owner">Brand Owner</option>
//           <option value="Authorized Reseller">Authorized Reseller</option>
//         </select>

//         {/* Business Information */}
//         <h2 className="text-xl font-semibold border-b pb-2 pt-4">Business Information</h2>
//         <input type="text" name="businessName" placeholder="Business Name" onChange={handleSellerChange} className="input" required />
//         <textarea name="businessAddress" placeholder="Business Address" onChange={handleSellerChange} className="input" required />
//         <div className="grid grid-cols-3 gap-4">
//           <input type="text" name="pinCode" placeholder="PIN Code" onChange={handleSellerChange} className="input" required />
//           <input type="text" name="city" placeholder="City" onChange={handleSellerChange} className="input" required />
//           <input type="text" name="state" placeholder="State" onChange={handleSellerChange} className="input" required />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//             <input type="text" name="gst" placeholder="GST Number (Optional)" onChange={handleSellerChange} className="input" />
//             <input type="text" name="pan" placeholder="PAN Number" onChange={handleSellerChange} className="input" required />
//         </div>

//         {/* Bank Details */}
//         <h2 className="text-xl font-semibold border-b pb-2 pt-4">Bank Details</h2>
//         <div className="grid grid-cols-2 gap-4">
//             <input type="text" name="bankAccount" placeholder="Bank Account Number" onChange={handleSellerChange} className="input" required />
//             <input type="text" name="ifsc" placeholder="IFSC Code" onChange={handleSellerChange} className="input" required />
//         </div>

//         {/* Store Setup */}
//         <h2 className="text-xl font-semibold border-b pb-2 pt-4">Store Setup</h2>
//         <input type="text" name="storeName" placeholder="Store Name" onChange={handleSellerChange} className="input" required />

//         {/* Upload Documents */}
//         <h2 className="text-xl font-semibold border-b pb-2 pt-4">Upload Documents</h2>
//         <div className="space-y-2">
//             <div>
//                 <label className="block font-medium mb-1">PAN Card *</label>
//                 <input type="file" name="panCard" onChange={handleFileChange} className="input-file" required />
//             </div>
//             <div>
//                 <label className="block font-medium mb-1">GST Certificate (Optional)</label>
//                 <input type="file" name="gstCertificate" onChange={handleFileChange} className="input-file" />
//             </div>
//             <div>
//                 <label className="block font-medium mb-1">Brand Authorization Certificate (Optional)</label>
//                 <input type="file" name="brandCertificate" onChange={handleFileChange} className="input-file" />
//             </div>
//             <div>
//                 <label className="block font-medium mb-1">Address Proof *</label>
//                 <input type="file" name="addressProof" onChange={handleFileChange} className="input-file" required />
//             </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-black text-white py-3 mt-6 rounded-lg hover:bg-gray-800 transition"
//         >
//           Register as Seller
//         </button>
//       </form>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
//       <div className="mb-6 flex space-x-4">
//         <button
//           onClick={() => setIsSeller(false)}
//           className={`px-6 py-3 rounded-full font-semibold transition ${
//             !isSeller ? "bg-black text-white shadow-lg" : "bg-white text-gray-700 border border-gray-300"
//           }`}
//         >
//           I want to **Buy** (Customer)
//         </button>
//         <button
//           onClick={() => setIsSeller(true)}
//           className={`px-6 py-3 rounded-full font-semibold transition ${
//             isSeller ? "bg-black text-white shadow-lg" : "bg-white text-gray-700 border border-gray-300"
//           }`}
//         >
//           I want to **Sell** (Seller)
//         </button>
//       </div>

//       {message && (
//         <p className={`mb-4 p-3 rounded text-center w-full max-w-2xl ${message.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//           {message}
//         </p>
//       )}

//       {isSeller ? renderSellerForm() : renderCustomerForm()}
      
//       <p className="mt-4 text-gray-600">
//         Already have an account? <Link to="/login" className="text-black font-semibold hover:underline">Log in here</Link>
//       </p>
//     </div>
//   );
// };

// export default RegistrationPage;

import React, { useState } from "react";

const RegistrationPage = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [message, setMessage] = useState("");

  // --- CUSTOMER SIGNUP STATE (UPDATED WITH FIRSTNAME & LASTNAME) ---
  const [customerFormData, setCustomerFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // --- SELLER REGISTRATION STATE ---
  const [sellerForm, setSellerForm] = useState({
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

  // --- HANDLERS ---
  const handleCustomerChange = (e) => {
    setCustomerFormData({ ...customerFormData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSellerChange = (e) => {
    setSellerForm({ ...sellerForm, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    
    // Validate firstName and lastName
    if (customerFormData.firstName.trim().length < 2) {
      setMessage("❌ First name must be at least 2 characters");
      return;
    }
    
    if (customerFormData.lastName.trim().length < 2) {
      setMessage("❌ Last name must be at least 2 characters");
      return;
    }

    if (customerFormData.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(customerFormData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP sent to your email! Redirecting to verification...");
        // Store email for OTP verification
        localStorage.setItem("pendingVerificationEmail", customerFormData.email);
        // Redirect to OTP page
        setTimeout(() => {
          window.location.href = `/verify-otp?email=${encodeURIComponent(customerFormData.email)}`;
        }, 1500);
      } else {
        setMessage("❌ " + (data.message || "Customer Signup failed"));
      }
    } catch (err) {
      setMessage("❌ Network error. Please try again.");
    }
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(sellerForm).forEach((key) => data.append(key, sellerForm[key]));
    Object.keys(documents).forEach((key) => {
      if (documents[key]) data.append(key, documents[key]);
    });

    try {
      const res = await fetch("http://localhost:5000/api/seller/register", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const resData = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({ role: "seller", ...resData.seller })
        );
        localStorage.setItem("token", resData.token);

        setMessage("✅ Seller registered successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage("❌ " + (resData.message || "Error submitting seller registration."));
      }
    } catch (err) {
      console.error("REG ERROR:", err);
      setMessage("❌ Network error. Please try again.");
    }
  };

  // --- RENDER FUNCTIONS ---
  const renderCustomerForm = () => (
    <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Customer Sign Up</h2>
      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={customerFormData.firstName}
            onChange={handleCustomerChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={customerFormData.lastName}
            onChange={handleCustomerChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={customerFormData.email}
            onChange={handleCustomerChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password (min 6 characters)"
            value={customerFormData.password}
            onChange={handleCustomerChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
            minLength={6}
            required
          />
        </div>

        <button
          onClick={handleCustomerSubmit}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
        >
          Sign Up as Customer
        </button>
      </div>
    </div>
  );

  const renderSellerForm = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ChronoHub Seller Registration
      </h1>
      <div className="space-y-4">
        {/* Account Details */}
        <h2 className="text-xl font-semibold border-b pb-2">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Seller Type */}
        <h2 className="text-xl font-semibold border-b pb-2 pt-4">Seller Type</h2>
        <select
          name="sellerType"
          onChange={handleSellerChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
          required
        >
          <option value="">Select Seller Type</option>
          <option value="Individual">Individual</option>
          <option value="Proprietorship">Proprietorship</option>
          <option value="Partnership">Partnership</option>
          <option value="Private Limited Company">Private Limited Company</option>
          <option value="Brand Owner">Brand Owner</option>
          <option value="Authorized Reseller">Authorized Reseller</option>
        </select>

        {/* Business Information */}
        <h2 className="text-xl font-semibold border-b pb-2 pt-4">Business Information</h2>
        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          onChange={handleSellerChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
          required
        />
        <textarea
          name="businessAddress"
          placeholder="Business Address"
          onChange={handleSellerChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
          rows="3"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="pinCode"
            placeholder="PIN Code"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="gst"
            placeholder="GST Number (Optional)"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
          />
          <input
            type="text"
            name="pan"
            placeholder="PAN Number"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Bank Details */}
        <h2 className="text-xl font-semibold border-b pb-2 pt-4">Bank Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="bankAccount"
            placeholder="Bank Account Number"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="text"
            name="ifsc"
            placeholder="IFSC Code"
            onChange={handleSellerChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Store Setup */}
        <h2 className="text-xl font-semibold border-b pb-2 pt-4">Store Setup</h2>
        <input
          type="text"
          name="storeName"
          placeholder="Store Name"
          onChange={handleSellerChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
          required
        />

        {/* Upload Documents */}
        <h2 className="text-xl font-semibold border-b pb-2 pt-4">Upload Documents</h2>
        <div className="space-y-3">
          <div>
            <label className="block font-medium mb-1">PAN Card *</label>
            <input
              type="file"
              name="panCard"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">GST Certificate (Optional)</label>
            <input
              type="file"
              name="gstCertificate"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Brand Authorization Certificate (Optional)
            </label>
            <input
              type="file"
              name="brandCertificate"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Address Proof *</label>
            <input
              type="file"
              name="addressProof"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
        </div>

        <button
          onClick={handleSellerSubmit}
          className="w-full bg-black text-white py-3 mt-6 rounded-lg hover:bg-gray-800 transition font-semibold"
        >
          Register as Seller
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setIsSeller(false)}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            !isSeller
              ? "bg-black text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
        >
          I want to Buy (Customer)
        </button>
        <button
          onClick={() => setIsSeller(true)}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            isSeller
              ? "bg-black text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
        >
          I want to Sell (Seller)
        </button>
      </div>

      {message && (
        <p
          className={`mb-4 p-3 rounded text-center w-full max-w-2xl ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </p>
      )}

      {isSeller ? renderSellerForm() : renderCustomerForm()}

      <p className="mt-4 text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-black font-semibold hover:underline">
          Log in here
        </a>
      </p>
    </div>
  );
};

export default RegistrationPage;