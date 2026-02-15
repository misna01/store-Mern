import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../shared/Navbar";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import { Loader2, CheckCircle, ChevronRight } from "lucide-react";

const PRODUCT_API = "http://localhost:5000/api/user/products";
const ADD_TO_CART_API = "http://localhost:5000/api/user/cart/add";
const ADD_TO_WISHLIST_API = "http://localhost:5000/api/user/wishlist/add";
const USER_WISHLIST_API = "http://localhost:5000/api/user/wishlist";
const RELATED_PRODUCTS_API = "http://localhost:5000/api/user/related-products";

const REVIEW_API = (id) =>
  `http://localhost:5000/api/user/products/${id}/reviews`;

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  // 🔥 Reviews
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // 🔍 Zoom
  const imgRef = useRef(null);
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState("0% 0%");

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRes = await axios.get(`${PRODUCT_API}/${id}`);
        const data = productRes.data;

        setProduct(data);
        setSelectedImage(data.images?.[0] || "");

        // Wishlist
        try {
          const wishlistRes = await axios.get(
            USER_WISHLIST_API,
            getAuthConfig()
          );
          const wishlistIds =
            wishlistRes.data?.products?.map(
              (item) => item.productId || item._id
            ) || [];
          setIsWishlisted(wishlistIds.includes(data._id));
        } catch {}

        // Related
        if (data.category) {
          const relatedRes = await axios.get(RELATED_PRODUCTS_API, {
            params: { category: data.category, excludeId: data._id },
          });
          setRelatedProducts(relatedRes.data || []);
        }
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Product not found"
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔍 Zoom logic
  const handleMouseMove = (e) => {
    const img = imgRef.current;
    if (!img) return;
    const { left, top, width, height } = img.getBoundingClientRect();

    let x = e.clientX - left;
    let y = e.clientY - top;
    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));

    setLensPos({ x, y });
    setBgPos(`${(x / width) * 100}% ${(y / height) * 100}%`);
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(
        ADD_TO_CART_API,
        { productId: product._id, quantity },
        getAuthConfig()
      );
      alert("Added to cart");
    } catch {
      alert("Cart error");
    }
  };

  const handleWishlist = async () => {
    try {
      await axios.post(
        ADD_TO_WISHLIST_API,
        { productId: product._id },
        getAuthConfig()
      );
      setIsWishlisted(!isWishlisted);
    } catch {
      alert("Wishlist error");
    }
  };

  // ⭐ SUBMIT REVIEW
  const submitReview = async () => {
    try {
      setReviewLoading(true);
      await axios.post(
        REVIEW_API(product._id),
        { rating, comment },
        getAuthConfig()
      );
      alert("Review added");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        {error}
      </div>
    );

  const finalPrice = product.salePrice || product.regularPrice;
  const discount = product.salePrice
    ? Math.round(
        ((product.regularPrice - product.salePrice) /
          product.regularPrice) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 pb-20">
      <Navbar />

      {/* BREADCRUMB */}
      <nav className="max-w-6xl mx-auto px-6 pt-6 flex items-center gap-2 text-xs text-gray-500 uppercase">
        <Link to="/" className="hover:text-amber-500">
          Store
        </Link>
        <ChevronRight size={12} />
        <span className="truncate">{product.name}</span>
      </nav>

      {/* ================= PRODUCT ================= */}
      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT - ZOOM */}
        <div className="lg:col-span-6">
          <div className="flex gap-4">
            {/* Thumbs */}
            <div className="flex flex-col gap-2">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 border rounded-lg overflow-hidden ${
                    selectedImage === img
                      ? "border-amber-500"
                      : "border-gray-800"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main */}
            <div className="relative flex-1">
              <div
                className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
                onMouseEnter={() => setShowLens(true)}
                onMouseLeave={() => setShowLens(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  ref={imgRef}
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-[520px] object-contain p-6"
                />

                {showLens && (
                  <div
                    className="absolute border border-amber-500/40 bg-amber-500/5 pointer-events-none"
                    style={{
                      width: "120px",
                      height: "120px",
                      left: lensPos.x - 60,
                      top: lensPos.y - 60,
                    }}
                  />
                )}
              </div>

              {/* Zoom Preview */}
              {showLens && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-2xl border border-amber-500/20"
                  style={{
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: "220%",
                    backgroundPosition: bgPos,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs border border-amber-500/30 px-2 py-1 rounded text-amber-500">
              {product.brand}
            </span>
            <div className="flex items-center text-amber-400 text-sm">
              <FaStar className="mr-1" />
              {product.averageRating?.toFixed(1) || "0.0"}
              <span className="text-gray-500 ml-2">
                ({product.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400">{product.description}</p>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-amber-500">
              ₹{finalPrice}
            </span>
            {discount > 0 && (
              <span className="line-through text-gray-500">
                ₹{product.regularPrice}
              </span>
            )}
            {discount > 0 && (
              <span className="text-green-500 text-sm">-{discount}%</span>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex border border-gray-800 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4"
              >
                –
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-amber-500 text-black rounded-lg py-3 font-bold flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              onClick={handleWishlist}
              className="border border-gray-800 rounded-lg px-4"
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
            </button>
          </div>

          <div className="flex gap-6 text-xs text-gray-400 pt-4">
            <div className="flex items-center gap-2">
              <FaTruck className="text-amber-500" /> Express Delivery
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-amber-500" /> Secure Checkout
            </div>
          </div>
        </div>
      </main>

      {/* ================= REVIEWS ================= */}
      <section className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-2xl mb-6">Customer Reviews</h2>

        {product.reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          product.reviews.map((r) => (
            <div key={r._id} className="border-b border-gray-800 py-4">
              <div className="text-amber-500">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              <p className="font-semibold">{r.name}</p>
              <p className="text-gray-400">{r.comment}</p>
            </div>
          ))
        )}

        {/* WRITE REVIEW */}
        <div className="mt-10 border-t border-gray-800 pt-6">
          <h3 className="text-xl mb-3">Write a Review</h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="bg-gray-900 border border-gray-800 p-2 mb-3"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 p-3 mb-3"
            placeholder="Write your review..."
          />

          <button
            onClick={submitReview}
            disabled={reviewLoading}
            className="bg-amber-500 text-black px-6 py-2 rounded font-bold disabled:opacity-50"
          >
            {reviewLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </section>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-24">
          <h2 className="text-xl font-bold mb-8">Related Items</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                to={`/product/${rp._id}`}
                key={rp._id}
                className="group bg-gray-900/10 border border-gray-800 rounded-2xl p-4 hover:border-amber-500/30"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-black mb-4">
                  <img
                    src={rp.image || rp.images?.[0]}
                    alt={rp.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition"
                  />
                </div>
                <h3 className="text-sm truncate">{rp.name}</h3>
                <p className="text-amber-500 font-bold mt-1 text-sm">
                  ₹{(rp.salePrice || rp.regularPrice).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
 