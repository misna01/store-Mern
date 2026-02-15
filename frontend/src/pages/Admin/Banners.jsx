import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  UploadCloud, 
  Link as LinkIcon, 
  FileText, 
  Trash2, 
  PlusCircle, 
  Image as ImageIcon,
  Loader2,
  ExternalLink
} from "lucide-react";

const API_URL = "http://localhost:5000/api/admin";

const Banners = () => {
  const [form, setForm] = useState({
    image: null,
    link: "",
    description: "",
  });
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/banners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners(res.data);
    } catch (err) {
      console.error("❌ Error fetching banners:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setForm({ ...form, image: file });
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image || !form.link || !form.description) {
      alert("Please fill all fields and upload an image");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("image", form.image);
      formData.append("link", form.link);
      formData.append("description", form.description);

      await axios.post(`${API_URL}/banner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Banner uploaded successfully!");
      setForm({ image: null, link: "", description: "" });
      setPreview(null);
      fetchBanners();
    } catch (err) {
      console.error("❌ Error uploading banner:", err.response?.data || err.message);
      alert("❌ Failed to upload banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBanners();
    } catch (err) {
      console.error("❌ Error deleting banner:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-indigo-200 shadow-lg">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Banner Management</h2>
            <p className="text-slate-500 text-sm">Upload and manage promotional banners for your store.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* UPLOAD SECTION */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-10">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <PlusCircle size={18} className="text-indigo-600" />
                  New Banner
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Banner Image</label>
                  <label className="relative group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-500" />
                        <p className="text-xs text-slate-500">Click to upload</p>
                      </div>
                    )}
                    <input type="file" name="image" className="hidden" accept="image/*" onChange={handleChange} required />
                  </label>
                </div>

                {/* Link Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Redirect Link</label>
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="link"
                      placeholder="https://example.com/promo"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={form.link}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Description</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-4 text-slate-400" />
                    <textarea
                      name="description"
                      placeholder="Flash Sale - 50% Off"
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={form.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Upload Banner</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* LIST SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Active Banners</h3>
               <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2 py-1 rounded-full">{banners.length} TOTAL</span>
            </div>

            {banners.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center">
                <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium tracking-tight">No banners have been uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {banners.map((b) => (
                  <div key={b._id} className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={b.image} alt={b.description} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                         <a href={b.link} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform">
                            <ExternalLink size={20} />
                         </a>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div className="mb-4">
                        <p className="text-slate-800 font-bold line-clamp-1">{b.description}</p>
                        <p className="text-slate-400 text-xs truncate mt-1">{b.link}</p>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(b._id)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                        Remove Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;