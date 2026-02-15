import { Award, Heart, Shield } from 'lucide-react';
import Navbar from "../../shared/Navbar";

// Define the colors for consistency with the premium theme
const GOLD_ACCENT = "text-yellow-500";
const DARK_BG = "bg-gray-950";
const TEXT_LIGHT = "text-white";
const TEXT_MUTED = "text-gray-400";

export default function About() {
  return (
    // Set the full-screen container with the premium dark background
    <div className={`min-h-screen ${DARK_BG} font-sans`}>
      {/* 🛠️ FIX: Navbar is placed here to span the full width */}
      <Navbar /> 

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        
        <div className="max-w-4xl mx-auto text-center">
          {/* ✨ PREMIUM STYLE: Light text, wide tracking, gold accent */}
          <h1 className={`text-5xl font-light ${TEXT_LIGHT} mb-4 tracking-widest uppercase`}>
            The PrimeCart Difference
          </h1>
          <p className={`text-xl ${TEXT_MUTED} mb-12 italic max-w-3xl mx-auto`}>
            Curated premium, delivered with trust. Your elevated lifestyle starts here.
          </p>
        </div>

        {/* --- Core Values Section (Enhanced) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-16">
          <div className="text-center p-6 border border-gray-800 rounded-lg transition duration-500 hover:border-yellow-500/50 hover:bg-gray-900">
            {/* ✨ PREMIUM STYLE: Gold/dark accent icons */}
            <div className={`inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-full mb-4 ring-2 ring-yellow-500/50`}>
              <Award className={`w-6 h-6 ${GOLD_ACCENT}`} />
            </div>
            <h3 className={`text-xl ${TEXT_LIGHT} mb-2 tracking-wider`}>Verified Premium</h3>
            <p className={TEXT_MUTED}>
              Every item is sourced from verified sellers and checked for authenticity and quality.
            </p>
          </div>
          
          <div className="text-center p-6 border border-gray-800 rounded-lg transition duration-500 hover:border-yellow-500/50 hover:bg-gray-900">
            <div className={`inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-full mb-4 ring-2 ring-yellow-500/50`}>
              <Heart className={`w-6 h-6 ${GOLD_ACCENT}`} />
            </div>
            <h3 className={`text-xl ${TEXT_LIGHT} mb-2 tracking-wider`}>Seamless Experience</h3>
            <p className={TEXT_MUTED}>
              From browsing to delivery, enjoy a smooth, reliable, and customer-focused journey.
            </p>
          </div>
          
          <div className="text-center p-6 border border-gray-800 rounded-lg transition duration-500 hover:border-yellow-500/50 hover:bg-gray-900">
            <div className={`inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-full mb-4 ring-2 ring-yellow-500/50`}>
              <Shield className={`w-6 h-6 ${GOLD_ACCENT}`} />
            </div>
            <h3 className={`text-xl ${TEXT_LIGHT} mb-2 tracking-wider`}>Protected Shopping</h3>
            <p className={TEXT_MUTED}>
              Secure payment gateways and a robust buyer protection policy for peace of mind.
            </p>
          </div>
        </div>

        {/* --- Our Story Block (Enhanced) --- */}
        <div className="bg-gray-900 rounded-lg p-12 my-16 shadow-2xl shadow-black/50 border border-gray-800">
          <h2 className={`text-3xl ${TEXT_LIGHT} font-light mb-6 tracking-wide border-b border-gray-700 pb-3`}>
            Our Commitment to Lifestyle
          </h2>
          <p className={`${TEXT_MUTED} text-lg mb-6 leading-relaxed`}>
            PrimeCart was founded to bridge the gap between discerning customers and high-quality, authentic products. We recognized the need for a trusted, multi-seller marketplace dedicated exclusively to the premium segment—be it a timeless watch, a durable leather bag, or the latest cutting-edge electronics.
          </p>
          <p className={`${TEXT_MUTED} text-lg leading-relaxed`}>
            Our focus is not just on transactions, but on building a community built on **trust and quality**. We vet every seller and stand by every product, ensuring that when you shop at PrimeCart, you are investing in durability, style, and peace of mind.
          </p>
        </div>

      </div>
    </div>
  );
}