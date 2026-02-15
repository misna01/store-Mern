import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";

/* ================= STYLES ================= */
const GOLD = "text-amber-400";
const DARK_BG = "bg-[#0a0a0a]";
const LIGHT_TEXT = "text-neutral-100";

/* ================= API ================= */
const FEATURED_PRODUCTS_API =
  "http://localhost:5000/api/user/featured-products";
const BANNERS_API = "http://localhost:5000/api/user/banners";
const HOME_CATEGORIES_API =
  "http://localhost:5000/api/user/home-categories";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // ================= DERIVE UNIQUE BRANDS =================
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  /* ================= FETCH FEATURED PRODUCTS ================= */
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get(FEATURED_PRODUCTS_API);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }
    };
    fetchFeaturedProducts();
  }, []);

  /* ================= FETCH BANNERS ================= */
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(BANNERS_API);
        setBanners(res.data);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };
    fetchBanners();
  }, []);

  /* ================= FETCH HOME CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(HOME_CATEGORIES_API);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch home categories", err);
      }
    };
    fetchCategories();
  }, []);

  /* ================= AUTO-ROTATE BANNERS ================= */
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  /* ================= LOADED ANIMATION ================= */
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen ${DARK_BG} relative overflow-x-hidden`}>
      {/* Animated Background Grain Effect */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      
      <Navbar />

      {/* ================= HERO BANNER WITH PARALLAX ================= */}
      <section className="relative w-full overflow-hidden">
        {banners.length === 0 ? (
          <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>

            {/* Decorative Lines */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute left-0 top-1/4 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className={`relative z-10 text-center px-6 max-w-6xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Top Ornament */}
              <div className="mb-12 flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500"></div>
                <div className="w-2 h-2 bg-amber-500 rotate-45"></div>
                <div className={`text-[10px] tracking-[0.5em] ${GOLD} font-light uppercase`}>
                  Maison d'Horlogerie
                </div>
                <div className="w-2 h-2 bg-amber-500 rotate-45"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>

              {/* Main Heading - Staggered Animation */}
              <h1 className={`text-6xl md:text-8xl lg:text-9xl mb-8 ${LIGHT_TEXT}`} style={{fontFamily: "'Playfair Display', serif"}}>
                <span className="block font-light italic opacity-90 transition-all duration-700" style={{animationDelay: '200ms'}}>
                  The Art of
                </span>
                <span className={`block font-bold ${GOLD} mt-2 transition-all duration-700`} style={{animationDelay: '400ms', textShadow: '0 0 40px rgba(251, 191, 36, 0.3)'}}>
                  Time
                </span>
              </h1>

              {/* Subtitle */}
              <div className="mb-12 max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-neutral-300 font-light tracking-wider leading-relaxed" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                  Where centuries of craftsmanship meet contemporary elegance.
                  <span className="block mt-2 text-neutral-400">
                    Each timepiece tells a story of precision and passion.
                  </span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
                <Link
                  to="/shop"
                  className={`group relative px-12 py-5 border-2 border-amber-500 ${GOLD} overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/50`}
                >
                  <span className="absolute inset-0 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative z-10 text-sm tracking-[0.3em] font-medium uppercase group-hover:text-black transition-colors duration-500">
                    Explore Collection
                  </span>
                </Link>
                
                <Link
                  to="/about"
                  className="px-12 py-5 border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-all duration-300"
                >
                  <span className="text-sm tracking-[0.3em] font-light uppercase">
                    Our Heritage
                  </span>
                </Link>
              </div>

              {/* Bottom Ornament */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-amber-500/50 rounded-full flex justify-center p-2">
                  <div className="w-1 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-screen">
            {/* Banner Images with Ken Burns Effect */}
            {banners.map((b, idx) => (
              <div
                key={b._id}
                className={`absolute inset-0 transition-opacity duration-2000 ${
                  idx === currentBanner ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={b.image}
                    alt="Banner"
                    className={`w-full h-full object-cover transition-transform duration-[20000ms] ${
                      idx === currentBanner ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
                
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              </div>
            ))}

            {/* Banner Content with Animation */}
            <div className="absolute inset-0 flex items-center justify-center text-white px-6 z-10">
              <div className="max-w-5xl text-center">
                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-amber-500"></div>
                  <div className={`text-xs tracking-[0.4em] ${GOLD} font-light uppercase`}>
                    Exclusive
                  </div>
                  <div className="h-px w-12 bg-amber-500"></div>
                </div>

                <h2 
  className={`text-3xl md:text-5xl lg:text-6xl font-light mb-8 ${LIGHT_TEXT} transition-all duration-1000`}
  style={{fontFamily: "'Playfair Display', serif"}}
  key={currentBanner}
>
  {banners[currentBanner]?.description || "Luxury Redefined"}
</h2>

                <p className="text-base md:text-lg text-neutral-200 mb-12 font-light tracking-wide max-w-2xl mx-auto" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                  Timeless sophistication crafted for those who appreciate the finer things
                </p>

                <Link
                  to="/shop"
                  className="group inline-block relative px-12 py-5 border-2 border-amber-500 text-amber-400 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-500"
                >
                  <span className="absolute inset-0 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative z-10 text-sm tracking-[0.3em] font-medium uppercase group-hover:text-black transition-colors">
                    Discover Collection
                  </span>
                </Link>
              </div>
            </div>

            {/* Modern Banner Navigation */}
            {banners.length > 1 && (
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className="group relative"
                  >
                    <div className={`h-1 transition-all duration-500 ${
                      idx === currentBanner
                        ? "w-16 bg-amber-500"
                        : "w-8 bg-neutral-600 hover:bg-neutral-400"
                    }`}></div>
                    {idx === currentBanner && (
                      <div className="absolute inset-0 bg-amber-500 blur-sm opacity-50"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ================= BRAND SHOWCASE ================= */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-amber-500"></div>
                <span className={`text-xs tracking-[0.5em] ${GOLD} uppercase font-light`}>
                  Curated Excellence
                </span>
                <div className="w-8 h-px bg-amber-500"></div>
              </div>
              <h3 
                className={`text-4xl md:text-6xl font-light ${LIGHT_TEXT} mb-4`}
                style={{fontFamily: "'Playfair Display', serif"}}
              >
                Prestigious <span className={`${GOLD} italic`}>Maisons</span>
              </h3>
              <p className="text-neutral-400 tracking-wider" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                Discover our collection of world-renowned watchmakers
              </p>
            </div>
          </div>

          {/* Brands Grid */}
          {brands.length === 0 ? (
            <p className="text-center text-neutral-500 font-light">
              No brands available at the moment.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {brands.map((brand, idx) => {
                const brandProduct = products.find(
                  (p) => p.brand === brand && p.image
                );

                const brandImage = brandProduct?.image
                  ? brandProduct.image.startsWith("http")
                    ? brandProduct.image
                    : `http://localhost:5000${brandProduct.image}`
                  : "/images/brands/default.jpg";

                return (
                  <Link
                    key={brand}
                    to={`/shop?brand=${encodeURIComponent(brand)}`}
                    className="group relative overflow-hidden bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-amber-500/50 transition-all duration-700"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 0.7s ease-out'
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={brandImage}
                        alt={brand}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/brands/default.jpg";
                        }}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                    </div>

                    {/* Brand Name Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                      <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                        <div className="h-px w-12 bg-amber-500 mx-auto mb-4 transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                        <h4 
                          className={`text-2xl tracking-[0.2em] ${GOLD} uppercase font-light text-center`}
                          style={{fontFamily: "'Playfair Display', serif"}}
                        >
                          {brand}
                        </h4>
                        <p className="text-xs text-neutral-400 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-widest">
                          EXPLORE
                        </p>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURED TIMEPIECES ================= */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-transparent to-neutral-950/50">
        {/* Decorative Background Element */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-amber-500"></div>
                <span className={`text-xs tracking-[0.5em] ${GOLD} uppercase font-light`}>
                  Featured Selection
                </span>
                <div className="w-8 h-px bg-amber-500"></div>
              </div>
              <h3 
                className={`text-4xl md:text-6xl font-light ${LIGHT_TEXT} mb-4`}
                style={{fontFamily: "'Playfair Display', serif"}}
              >
                Masterpiece <span className={`${GOLD} italic`}>Collection</span>
              </h3>
              <p className="text-neutral-400 tracking-wider" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                Handpicked horological excellence
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <p className="text-center text-neutral-500 font-light">
              No featured products available.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p, idx) => (
                <div
                  key={p._id}
                  className="group relative bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 hover:border-amber-500/50 transition-all duration-700 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out'
                  }}
                >
                  {/* Product Image */}
                  <div className="relative bg-black/40 p-8 overflow-hidden aspect-square flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 text-center relative">
                    {/* Brand Badge */}
                    {p.brand && (
                      <div className="inline-block mb-3">
                        <span className={`text-[10px] tracking-[0.3em] ${GOLD} uppercase font-light px-3 py-1 border border-amber-500/30`}>
                          {p.brand}
                        </span>
                      </div>
                    )}

                    {/* Product Name */}
                    <h4 
                      className={`text-lg md:text-xl mb-2 ${LIGHT_TEXT} font-light tracking-wide min-h-[56px] flex items-center justify-center`}
                      style={{fontFamily: "'Cormorant Garamond', serif"}}
                    >
                      {p.name}
                    </h4>

                    {/* Description */}
                    {p.description && (
                      <p className="text-xs text-neutral-400 mb-4 line-clamp-2 font-light leading-relaxed h-10">
                        {p.description}
                      </p>
                    )}

                    {/* Decorative Line */}
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mb-4"></div>

                    {/* Price */}
                    <p 
                      className={`text-2xl font-light ${GOLD} tracking-wide mb-6`}
                      style={{fontFamily: "'Playfair Display', serif"}}
                    >
                      ₹{p.price.toLocaleString('en-IN')}
                    </p>

                    {/* CTA Button */}
                    <Link
                      to={`/product/${p._id}`}
                      className="relative inline-block border border-neutral-700 text-neutral-300 px-8 py-3 uppercase text-[10px] tracking-[0.3em] font-medium overflow-hidden group/btn transition-all duration-300 hover:border-amber-500"
                    >
                      <span className="absolute inset-0 bg-amber-500 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></span>
                      <span className="relative z-10 group-hover/btn:text-black transition-colors duration-300">
                        View Details
                      </span>
                    </Link>
                  </div>

                  {/* Corner Decorations */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-amber-500/0 group-hover:border-amber-500/50 transition-all duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-amber-500/0 group-hover:border-amber-500/50 transition-all duration-500"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= LUXURY FEATURES ================= */}
      <section className="relative py-32 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: "◆",
                title: "Swiss Precision",
                desc: "Certified movements from renowned manufacturers"
              },
              {
                icon: "◈",
                title: "Authenticity Guaranteed",
                desc: "Every timepiece comes with certificate of authenticity"
              },
              {
                icon: "◇",
                title: "Lifetime Service",
                desc: "Complimentary maintenance and expert care"
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="text-center group"
                style={{
                  animationDelay: `${idx * 150}ms`,
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.7s ease-out'
                }}
              >
                <div className={`text-5xl ${GOLD} mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h4 
                  className={`text-xl ${LIGHT_TEXT} mb-3 tracking-wider`}
                  style={{fontFamily: "'Cormorant Garamond', serif"}}
                >
                  {feature.title}
                </h4>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ELEGANT FOOTER ================= */}
      <footer className="relative border-t border-neutral-900 mt-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* Brand Section */}
          <div className="text-center mb-12">
            <h5 
              className={`text-4xl font-light tracking-[0.3em] ${GOLD} mb-2`}
              style={{fontFamily: "'Playfair Display', serif"}}
            >
              WATCH MAISON
            </h5>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500"></div>
              <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <p 
              className="text-neutral-400 text-sm tracking-wider"
              style={{fontFamily: "'Cormorant Garamond', serif"}}
            >
              Purveyors of Fine Timepieces Since Inception
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center md:text-left">
            {[
              {title: "Collections", links: ["New Arrivals", "Vintage", "Limited Edition", "Gift Sets"]},
              {title: "Services", links: ["Repairs", "Customization", "Appraisal", "Trade-In"]},
              {title: "Company", links: ["About Us", "Our Story", "Craftsmen", "Careers"]},
              {title: "Connect", links: ["Contact", "Showrooms", "Newsletter", "Support"]}
            ].map((section, idx) => (
              <div key={idx}>
                <h6 className={`text-sm ${GOLD} tracking-widest uppercase mb-4 font-light`}>
                  {section.title}
                </h6>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a 
                        href="#" 
                        className="text-neutral-400 hover:text-amber-400 text-sm transition-colors duration-300 font-light"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
            <p className="font-light">
              © {new Date().getFullYear()} Watch Maison. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
};

export default Home;