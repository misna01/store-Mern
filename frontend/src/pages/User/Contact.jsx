import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from "../../shared/Navbar";

// Define the colors for consistency with the premium theme
const GOLD_ACCENT = "text-yellow-500";
const DARK_BG = "bg-gray-950";
const TEXT_LIGHT = "text-white";
const TEXT_MUTED = "text-gray-400";
const INPUT_FIELD = "bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission (e.g., Axios post request)
    alert("Message sent successfully! We will get back to you shortly.");
    e.target.reset(); // Reset form fields
  };

  return (
    <div className={`min-h-screen ${DARK_BG} font-sans`}>
      <Navbar /> 

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        
        {/* Contact Page Header */}
        <header className="text-center mb-16 pt-8">
            <h1 className={`text-5xl font-light ${TEXT_LIGHT} mb-4 tracking-widest uppercase`}>
                <span className={GOLD_ACCENT}>—</span> CONTACT MAISON <span className={GOLD_ACCENT}>—</span>
            </h1>
            <p className={`text-xl ${TEXT_MUTED} max-w-3xl mx-auto`}>
                We are here to assist you with any inquiries regarding our collections or services.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* 1. Contact Information */}
            <div className="lg:col-span-1 space-y-8 p-8 bg-gray-900 rounded-xl shadow-2xl shadow-black/50 border border-gray-800">
                <h2 className={`text-3xl font-light ${TEXT_LIGHT} mb-6 border-b border-gray-700 pb-3`}>
                    Get in Touch
                </h2>

                <div className="flex items-start space-x-4">
                    <Mail className={`w-6 h-6 flex-shrink-0 mt-1 ${GOLD_ACCENT}`} />
                    <div>
                        <h3 className={`text-lg font-semibold ${TEXT_LIGHT}`}>Email Support</h3>
                        <p className={TEXT_MUTED}>support@primemaison.com</p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <Phone className={`w-6 h-6 flex-shrink-0 mt-1 ${GOLD_ACCENT}`} />
                    <div>
                        <h3 className={`text-lg font-semibold ${TEXT_LIGHT}`}>Phone</h3>
                        <p className={TEXT_MUTED}>+1 (555) 123-4567</p>
                        <p className="text-sm text-gray-600">Mon - Fri, 9:00 AM - 5:00 PM EST</p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <MapPin className={`w-6 h-6 flex-shrink-0 mt-1 ${GOLD_ACCENT}`} />
                    <div>
                        <h3 className={`text-lg font-semibold ${TEXT_LIGHT}`}>Showroom</h3>
                        <p className={TEXT_MUTED}>101 Luxury Avenue, Suite 400</p>
                        <p className={TEXT_MUTED}>New York, NY 10001</p>
                    </div>
                </div>

            </div>

            {/* 2. Contact Form */}
            <div className="lg:col-span-2 p-8 bg-gray-900 rounded-xl shadow-2xl shadow-black/50 border border-gray-800">
                <h2 className={`text-3xl font-light ${TEXT_LIGHT} mb-8`}>
                    Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className={`block text-sm font-medium mb-2 ${TEXT_MUTED}`}>
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className={`w-full p-3 rounded-lg ${INPUT_FIELD}`}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium mb-2 ${TEXT_MUTED}`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className={`w-full p-3 rounded-lg ${INPUT_FIELD}`}
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${TEXT_MUTED}`}>
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className={`w-full p-3 rounded-lg ${INPUT_FIELD}`}
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className={`block text-sm font-medium mb-2 ${TEXT_MUTED}`}>
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            required
                            className={`w-full p-3 rounded-lg ${INPUT_FIELD}`}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-gray-950 px-6 py-3 rounded-lg uppercase text-md font-semibold tracking-wider hover:bg-yellow-400 transition duration-300 shadow-md"
                    >
                        Send Inquiry
                    </button>
                </form>
            </div>
        </div>
      </section>
    </div>
  );
}