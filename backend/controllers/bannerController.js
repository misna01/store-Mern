import Banner from "../models/bannerModel.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Add Banner
export const addBanner = async (req, res) => {
  try {
    const { link, description } = req.body;

    if (!req.file || !link || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "banners" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res
            .status(500)
            .json({ message: "Cloudinary upload failed", error });
        }

        const newBanner = new Banner({
          image: result.secure_url,
          link,
          description,
        });

        await newBanner.save();
        res.status(201).json({
          message: "✅ Banner added successfully",
          banner: newBanner,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("❌ Error adding banner:", err);
    res.status(500).json({ message: "Failed to add banner" });
  }
};

// ✅ Get All Banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ _id: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // 🧹 Optional: Delete from Cloudinary (if stored there)
    const publicId = banner.image.split("/").pop().split(".")[0]; // extract public ID
    try {
      await cloudinary.uploader.destroy(`banners/${publicId}`);
    } catch (cloudErr) {
      console.warn("Cloudinary deletion failed:", cloudErr.message);
    }

    await Banner.findByIdAndDelete(id);
    res.json({ message: "✅ Banner deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting banner:", err.message);
    res.status(500).json({ message: "Failed to delete banner" });
  }
};
// controllers/bannerController.js

export const getAllShopBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    console.log("🖼️ Banners found:", banners); // 👈 Add this
    res.status(200).json(banners);
  } catch (err) {
    console.error("❌ Error fetching banners:", err.message);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

