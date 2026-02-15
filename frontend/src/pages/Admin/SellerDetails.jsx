import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, Briefcase, MapPin, Landmark, 
  FileText, Package, ExternalLink, Mail, Phone, ArrowLeft 
} from "lucide-react"; 

const SellerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for back button
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerDetails = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `http://localhost:5000/api/admin/seller/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSeller(res.data.seller);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching seller details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerDetails();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!seller) return <p className="p-6 text-center text-slate-500 font-medium">Seller not found.</p>;

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: "bg-emerald-100 text-emerald-700",
      PENDING: "bg-amber-100 text-amber-700",
      BLOCKED: "bg-rose-100 text-rose-700",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
              <ArrowLeft size={20} />
            </div>
            Back to Dashboard
          </button>
          <div className="text-right">
             <span className="text-xs font-bold text-slate-400 uppercase">Admin Portal</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {seller.storeName || "Seller Profile"}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 uppercase">Account ID</span>
              <span className="font-mono text-sm">{seller._id}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-current shadow-sm ${getStatusBadge(seller.status)}`}>
              {seller.status}
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PRIMARY INFORMATION */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PERSONAL INFO CARD */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white"><User size={20} /></div>
                <h2 className="font-extrabold text-slate-800 text-lg uppercase tracking-tight">Identity Details</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[11px] uppercase font-black text-slate-400 block mb-2 tracking-widest">Full Name</label>
                  <p className="text-slate-800 font-bold text-lg">{seller.fullName}</p>
                </div>
                <div>
                  <label className="text-[11px] uppercase font-black text-slate-400 block mb-2 tracking-widest">Classification</label>
                  <p className="text-slate-800 font-bold text-lg">{seller.sellerType}</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <Mail size={20} className="text-indigo-500" />
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Email Address</label>
                    <p className="text-slate-700 font-medium">{seller.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <Phone size={20} className="text-emerald-500" />
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Mobile Number</label>
                    <p className="text-slate-700 font-medium">{seller.phone}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* BUSINESS REGISTRATION CARD */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white"><Briefcase size={20} /></div>
                <h2 className="font-extrabold text-slate-800 text-lg uppercase tracking-tight">Business Assets</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[11px] uppercase font-black text-slate-400 block mb-2 tracking-widest">Legal Entity Name</label>
                  <p className="text-slate-800 font-bold">{seller.businessName}</p>
                </div>
                <div>
                  <label className="text-[11px] uppercase font-black text-slate-400 block mb-2 tracking-widest">Public Storefront</label>
                  <p className="text-slate-800 font-bold">{seller.storeName}</p>
                </div>
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                  <label className="text-[10px] uppercase font-black text-indigo-400 block mb-1">GST Identification</label>
                  <p className="text-indigo-700 font-black text-xl tracking-tight leading-none">{seller.gst}</p>
                </div>
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                  <label className="text-[10px] uppercase font-black text-indigo-400 block mb-1">Tax PAN Number</label>
                  <p className="text-indigo-700 font-black text-xl tracking-tight leading-none">{seller.pan}</p>
                </div>
              </div>
            </section>

            {/* PRODUCT LIST SECTION */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white"><Package size={20} /></div>
                <h2 className="font-extrabold text-slate-800 text-lg uppercase tracking-tight">Inventory Catalog</h2>
              </div>
              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="p-16 text-center">
                    <Package size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 text-sm font-medium">No products currently listed.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 text-[11px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">Item Name</th>
                        <th className="px-8 py-4">Sale Value</th>
                        <th className="px-8 py-4">Stock Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-5 font-bold text-slate-700 group-hover:text-indigo-600">{p.name}</td>
                          <td className="px-8 py-5 text-slate-600 font-black">₹{p.salePrice}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: SECONDARY DETAILS */}
          <div className="space-y-8">
            
            {/* LOCATION CARD */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <MapPin size={20} className="text-indigo-600" />
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-widest">Business Hub</h2>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl italic border border-slate-100">
                  "{seller.businessAddress}"
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">City</label>
                    <p className="text-slate-700 text-sm font-bold">{seller.city}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Pin Code</label>
                    <p className="text-slate-700 text-sm font-bold tracking-widest">{seller.pinCode}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* BANK ACCOUNT CARD */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <Landmark size={20} className="text-indigo-600" />
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-widest">Financials</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="p-4 border border-dashed border-slate-200 rounded-2xl">
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1 tracking-wider">Bank Account</label>
                  <p className="text-slate-700 font-mono font-bold text-base select-all tracking-tighter">{seller.bankAccount}</p>
                </div>
                <div className="p-4 border border-dashed border-slate-200 rounded-2xl">
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1 tracking-wider">IFSC Routing</label>
                  <p className="text-slate-700 font-mono font-bold text-base select-all tracking-tighter">{seller.ifsc}</p>
                </div>
              </div>
            </section>

            {/* KYC DOCUMENTS CARD */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <FileText size={20} className="text-indigo-600" />
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-widest">KYC Vault</h2>
              </div>
              <div className="p-6">
                {seller.documents ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(seller.documents).map(([key, url]) => (
                      url && (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-600 hover:text-white transition-all group shadow-sm"
                        >
                          <span className="text-xs font-black uppercase tracking-tight">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <ExternalLink size={16} className="opacity-50 group-hover:opacity-100" />
                        </a>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic text-center py-4">Verification documents missing.</p>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerDetails;