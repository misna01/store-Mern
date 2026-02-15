import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, Eye, Check, Ban, Trash2, Package } from "lucide-react"; // Optional: icons make it more interesting

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    regularPrice: "",
    salePrice: "",
    images: [],
  });

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= HANDLE FORM ================= */
  const handleChange = (e) => {
    if (e.target.name === "images") {
      if (e.target.files.length > 5) {
        alert("Maximum 5 images allowed");
        return;
      }
      setForm({ ...form, images: [...e.target.files] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  /* ================= ADD PRODUCT ================= */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.regularPrice || !form.salePrice) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("regularPrice", form.regularPrice);
      formData.append("salePrice", form.salePrice);
      form.images.forEach((img) => formData.append("images", img));

      await axios.post("http://localhost:5000/api/admin/product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully");
      setForm({
        name: "", brand: "", description: "", category: "",
        regularPrice: "", salePrice: "", images: [],
      });
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTION HANDLER ================= */
  const actionHandler = async (url) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Action failed");
    }
  };

  /* ================= VIEW HANDLER ================= */
  const viewHandler = async (productId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`http://localhost:5000/api/admin/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewProduct(res.data.product);
      setViewOpen(true);
    } catch (error) {
      alert("Failed to load product details");
    }
  };

  /* ================= STATUS BADGE ================= */
  const badge = (status) => {
    const map = {
      APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
      BLOCKED: "bg-slate-200 text-slate-700 border-slate-300",
    };
    return map[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 text-sm">Review, approve, and manage marketplace products.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm ${
            showAddForm ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
          }`}
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? "Cancel" : "Add New Product"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================= ADD PRODUCT FORM ================= */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-xl font-bold">Product Specifications</h2>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Product Name</label>
                <input name="name" placeholder="e.g. Wireless Headphones" value={form.name} onChange={handleChange} className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Brand</label>
                <input name="brand" placeholder="e.g. Sony" value={form.brand} onChange={handleChange} className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required>
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Regular Price</label>
                  <input name="regularPrice" type="number" placeholder="₹" value={form.regularPrice} onChange={handleChange} className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Sale Price</label>
                  <input name="salePrice" type="number" placeholder="₹" value={form.salePrice} onChange={handleChange} className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Product Images (Max 5)</label>
                <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-dashed border-slate-300 p-4 rounded-xl" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Description</label>
                <textarea name="description" rows="3" placeholder="Tell us more about the product..." value={form.description} onChange={handleChange} className="w-full border border-slate-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              <button type="submit" disabled={loading} className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                {loading ? "Processing..." : "Publish Product"}
              </button>
            </form>
          </div>
        )}

        {/* ================= PRODUCT TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Product Info</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Pricing</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Source</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package className="m-auto mt-3 text-slate-400" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-slate-500 uppercase font-medium">{p.category}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-indigo-600 font-bold text-base">₹{p.salePrice}</span>
                        <span className="text-slate-400 line-through text-xs">₹{p.regularPrice}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${badge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${p.sellerId ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                        {p.sellerId ? "Seller" : "In-House"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => viewHandler(p._id)} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm" title="View Details">
                          <Eye size={16} />
                        </button>
                        
                        {p.status === "PENDING" && (
                          <>
                            <button onClick={() => actionHandler(`http://localhost:5000/api/admin/product/approve/${p._id}`)} className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-100" title="Approve">
                              <Check size={16} />
                            </button>
                            <button onClick={() => actionHandler(`http://localhost:5000/api/admin/product/reject/${p._id}`)} className="p-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100" title="Reject">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}

                        {(p.status === "APPROVED" || p.status === "BLOCKED") && (
                          <button onClick={() => actionHandler(`http://localhost:5000/api/admin/product/block/${p._id}`)} className={`p-2 rounded-lg border transition-colors ${p.status === "BLOCKED" ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" : "bg-slate-800 text-white hover:bg-black"}`} title={p.status === "BLOCKED" ? "Unblock" : "Block"}>
                            <Ban size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="p-20 text-center">
              <Package size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500">No products found in the database.</p>
            </div>
          )}
        </div>

        {/* ================= VIEW PRODUCT MODAL ================= */}
        {viewOpen && viewProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
              
              <button onClick={() => setViewOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors z-10">
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                {/* Image Section */}
                <div className="md:w-1/2 bg-slate-50 p-8 flex flex-col gap-4 overflow-y-auto">
                  <div className="aspect-square bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden border border-slate-200">
                     <img src={viewProduct.images?.[0]} className="w-full h-full object-contain" alt="Main" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {viewProduct.images.slice(1).map((img, i) => (
                      <div key={i} className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <img src={img} className="w-full h-full object-cover" alt="gallery" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-8 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wider">{viewProduct.category}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border ${badge(viewProduct.status)}`}>{viewProduct.status}</span>
                  </div>
                  
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{viewProduct.name}</h2>
                  <p className="text-slate-400 font-medium mb-6">Brand: {viewProduct.brand || "Generic"}</p>

                  <div className="flex items-baseline gap-4 mb-8">
                    <p className="text-3xl font-black text-indigo-600">₹{viewProduct.salePrice}</p>
                    <p className="text-slate-400 line-through">₹{viewProduct.regularPrice}</p>
                    <p className="text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded">
                      {Math.round(((viewProduct.regularPrice - viewProduct.salePrice) / viewProduct.regularPrice) * 100)}% OFF
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Description</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{viewProduct.description || "No detailed description provided for this product."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                      <div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">Inventory</h3>
                        <p className="font-semibold text-slate-700">{viewProduct.stock || "0"} Units available</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-1">Identifier</h3>
                        <p className="font-mono text-[10px] text-slate-500">{viewProduct._id}</p>
                      </div>
                    </div>

                    {viewProduct.sellerId && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold uppercase text-slate-500 mb-3">Seller Details</h3>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">{viewProduct.sellerId.shopName}</p>
                          <p className="text-xs text-slate-500">{viewProduct.sellerId.name} • {viewProduct.sellerId.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProducts;