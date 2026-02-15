import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/Navbar"; // 👈 Import the Navbar
const SellerProfile = () => {
    const navigate = useNavigate();
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchSellerProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                // Redirect to login if no token is found
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/seller/profile",
                    {
                        headers: {
                            // Assuming your backend uses 'Authorization: Bearer <token>' for auth
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSellerData(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching seller profile:", err);
                setError(
                    "Failed to load profile. Please log in again. (" +
                    (err.response?.data?.message || err.message) +
                    ")"
                );
                // Optional: clear token and redirect on 401/403 errors
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSellerProfile();
    }, [navigate]);

    // Helper to render sections (kept outside render logic for clarity)
    const renderSection = (title, data) => (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold mb-3 border-b pb-2 text-gray-700">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key}>
                        <p className="text-sm font-medium text-gray-500">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                        </p>
                        <p className="text-base font-semibold text-gray-900 break-words">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );

    // --- Conditional Render Blocks ---

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center bg-gray-100">
                    <p className="text-xl font-semibold">Loading Seller Profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center bg-gray-100">
                    <p className="text-xl font-semibold text-red-600 p-4 border border-red-300 bg-red-50 rounded">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // Deconstruct data after loading check
    const { fullName, email, phone, sellerType, status, businessName, businessAddress, pinCode, city, state, gst, pan, bankAccount, ifsc, storeName, documents } = sellerData;

    const accountInfo = { fullName, email, phone, status: status || 'N/A' };
    const businessInfo = { businessName, businessAddress, pinCode, city, state, sellerType, gst: gst || 'N/A', pan };
    const storeInfo = { storeName };

    return (
        // 👈 Main container now uses flex-col to stack Navbar and content
        <div className="min-h-screen flex flex-col bg-gray-100"> 
            
            <Navbar /> {/* 👈 Navbar placed at the top */}

            {/* Main Profile Content Area */}
            <div className="py-10 px-4 sm:px-6 lg:px-8 flex-1"> 
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                    <header className="mb-8 border-b pb-4">
                        <h1 className="text-4xl font-extrabold text-black">
                            👋 Seller Profile
                        </h1>
                        <p className={`mt-2 text-lg font-semibold ${status === 'APPROVED' ? 'text-green-600' : status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'}`}>
                            Account Status: {status}
                        </p>
                    </header>

                    {renderSection("Personal & Account Details", accountInfo)}
                    {renderSection("Business Information", businessInfo)}
                    {renderSection("Store Details", storeInfo)}
                    
                    {/* Render Bank Details section */}
                    {renderSection("Bank Details (last 4 digits shown)", {
                        // Masking bank details for security in the UI, show only the last 4
                        'Bank Account': `**** **** **** ${bankAccount ? bankAccount.slice(-4) : 'N/A'}`,
                        'IFSC Code': ifsc
                    })}
                    
                    {/* Documents Section */}
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-bold mb-3 border-b pb-2 text-gray-700">Uploaded Documents</h3>
                        <ul className="list-disc ml-5 space-y-2">
                            {documents && Object.entries(documents).map(([docKey, docUrl]) => (
                                <li key={docKey} className="text-sm text-gray-800">
                                    {docKey.charAt(0).toUpperCase() + docKey.slice(1).replace(/([A-Z])/g, ' $1')}: 
                                    {docUrl ? (
                                        <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                                            View Document
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 ml-2">Not Provided</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                  
                    <footer className="mt-8 pt-4 border-t text-center">
                        <button
                            onClick={() => navigate('/seller/edit-profile')}
                            className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition font-semibold"
                        >
                            Edit Profile
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;