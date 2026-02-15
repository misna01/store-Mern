import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // ✅ Load env early (safe for standalone import)

import { v2 as cloudinary } from "cloudinary";

// ✅ Optional debug
console.log("Cloudinary Config Loaded:", {
  name: process.env.CLOUD_NAME,
  key: process.env.CLOUD_API_KEY ? "✅ loaded" : "❌ missing",
  secret: process.env.CLOUD_API_SECRET ? "✅ loaded" : "❌ missing",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;
