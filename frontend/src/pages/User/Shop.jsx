

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../shared/Navbar";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";
import { Loader2, ShoppingCart, Eye } from "lucide-react";

/* ================= API ================= */
const PRODUCTS_API = "http://localhost:5000/api/user/shop-products";

const Shop = () => {
  /* =====================================================
     ✅ UPDATE #1: AUTH MOVED INTO REACT STATE (MAIN FIX)
     ===================================================== */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  /* ================= DATA ================= */
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTER OPTIONS ================= */
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ================= SELECTED FILTERS ================= */
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  /* =====================================================
     ✅ UPDATE #2: READ LOCALSTORAGE AFTER COMPONENT LOAD
     ===================================================== */
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    setUser(userStr ? JSON.parse(userStr) : null);
    setToken(storedToken);
  }, []);

  /* =====================================================
     ✅ UPDATE #3: APIs DEPEND ON USER STATE
     ===================================================== */
  const CART_ADD_API =
    user?.role === "seller"
      ? "http://localhost:5000/api/seller/cart/add"
      : "http://localhost:5000/api/user/cart/add";

  const WISHLIST_BASE_API =
    user?.role === "seller"
      ? "http://localhost:5000/api/seller/wishlist"
      : "http://localhost:5000/api/user/wishlist";

  const WISHLIST_ADD_API = `${WISHLIST_BASE_API}/add`;

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async (useFilters = false) => {
    setLoading(true);
    try {
      const params = {};

      if (useFilters) {
        if (search) params.search = search;
        if (brand !== "all") params.brand = brand;
        if (category !== "all") params.category = category;

        if (priceRange !== "all") {
          const [min, max] = priceRange.split("-");
          params.minPrice = min;
          params.maxPrice = max;
        }
      }

      const res = await axios.get(PRODUCTS_API, { params });
      const data = res.data || [];

      setProducts(data);

      /* ================= AUTO FILTER OPTIONS ================= */
      setBrands([...new Set(data.map(p => p.brand).filter(Boolean))]);
      setCategories([...new Set(data.map(p => p.category).filter(Boolean))]);
    } catch (err) {
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchProducts(false);
  }, []);

  /* =====================================================
     ✅ UPDATE #4: WISHLIST FETCH WAITS FOR TOKEN
     ===================================================== */
  useEffect(() => {
    if (!token) return;

    axios
      .get(WISHLIST_BASE_API, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const ids =
          res.data?.items?.map(
            item => item.productId?._id || item.productId
          ) || [];
        setWishlist(ids);
      })
      .catch(err => {
        console.error("Wishlist fetch error:", err);
      });
  }, [token, WISHLIST_BASE_API]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (productId) => {
    if (!token) return alert("Please login first");

    try {
      await axios.post(
        CART_ADD_API,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  /* ================= WISHLIST ================= */
  const handleWishlist = async (productId) => {
    if (!token) return alert("Please login first");

    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`${WISHLIST_BASE_API}/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post(
          WISHLIST_ADD_API,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  /* ================= FILTER ACTIONS ================= */
  const applyFilters = () => fetchProducts(true);

  const clearFilters = () => {
    setSearch("");
    setBrand("all");
    setCategory("all");
    setPriceRange("all");
    fetchProducts(false);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar />

      {/* SEARCH */}
      <div className="pt-12 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Search by name or brand..."
              className="w-full bg-[#151515] pl-12 py-4 rounded-xl border border-gray-800"
            />
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-10 flex gap-10">

        {/* ================= FILTER SIDEBAR ================= */}
        <aside className="w-72">
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 space-y-6 sticky top-28">
            <div className="flex items-center gap-2 text-amber-500 text-sm font-bold">
              <FaSlidersH /> Filters
            </div>

            {/* BRAND */}
            <select value={brand} onChange={e => setBrand(e.target.value)}
              className="w-full bg-[#1a1a1a] p-3 rounded-xl">
              <option value="all">All Brands</option>
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>

            {/* CATEGORY */}
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#1a1a1a] p-3 rounded-xl">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            {/* PRICE */}
            <select value={priceRange} onChange={e => setPriceRange(e.target.value)}
              className="w-full bg-[#1a1a1a] p-3 rounded-xl">
              <option value="all">All Prices</option>
              <option value="0-1000">Below ₹1,000</option>
              <option value="1000-5000">₹1,000 – ₹5,000</option>
              <option value="5000-10000">₹5,000 – ₹10,000</option>
              <option value="10000-999999">Above ₹10,000</option>
            </select>

            <button onClick={applyFilters}
              className="w-full bg-amber-500 text-black py-3 rounded-xl font-bold">
              Apply Filters
            </button>

            <button onClick={clearFilters}
              className="w-full text-gray-400 text-sm flex items-center justify-center gap-1">
              <FaTimes /> Clear All
            </button>
          </div>
        </aside>

        {/* ================= PRODUCTS ================= */}
        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-amber-500 w-10 h-10" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(p => (
                <div key={p._id} className="bg-[#111] p-5 rounded-xl relative">
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Link to={`/product/${p._id}`} className="p-2 bg-black/70 rounded-full">
                      <Eye size={16} />
                    </Link>
                    <button onClick={() => handleWishlist(p._id)}
                      className="p-2 bg-black/70 rounded-full">
                      {wishlist.includes(p._id)
                        ? <FaHeart className="text-red-500" />
                        : <FaRegHeart />}
                    </button>
                  </div>

                  <img src={p.image} alt={p.name}
                    className="h-48 w-full object-contain mb-4" />

                  <p className="text-xs text-amber-500">{p.brand}</p>
                  <h3>{p.name}</h3>
                  <p className="text-amber-500 font-bold">
                    ₹{p.salePrice || p.regularPrice}
                  </p>

                  <button onClick={() => handleAddToCart(p._id)}
                    className="mt-3 w-full bg-gray-800 hover:bg-amber-500 p-2 rounded flex justify-center gap-2">
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

export default Shop;
