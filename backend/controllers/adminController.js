import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";


import { uploadBufferToCloudinary } from "../config/uploadToCloudinary.js";

import Seller from "../models/sellerModel.js";

/* 🔹 Get all users */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* 🔹 Get all sellers */
// export const getAllSellers = async (req, res) => {
//   try {
//     const sellers = await Seller.find().sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       total: sellers.length,
//       sellers,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch sellers" });
//   }
// };
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
};
export const approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.status = "APPROVED";
    await seller.save();

    res.json({ success: true, message: "Seller approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};
export const rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.status = "REJECTED";
    await seller.save();

    res.json({ success: true, message: "Seller rejected" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
};
export const toggleBlockSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.status =
      seller.status === "BLOCKED" ? "APPROVED" : "BLOCKED";

    await seller.save();

    res.json({
      success: true,
      message:
        seller.status === "BLOCKED"
          ? "Seller blocked"
          : "Seller unblocked",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update seller" });
  }
};


/* 🔹 Dashboard Counts */
export const getAdminCounts = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ isAdmin: false });
    const sellersCount = await Seller.countDocuments();

    res.json({
      success: true,
      users: usersCount,
      sellers: sellersCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch counts" });
  }
};



const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const admin = await User.findOne({ email });

    // Check if admin exists
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Check if user is actually an admin
    if (!admin.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// export const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       brand,
//       description,
//       regularPrice,
//       salePrice,
//       category,
//     } = req.body;

//     if (!name || !regularPrice || !salePrice || !category) {
//       return res.status(400).json({
//         message: "Name, Regular Price, Sale Price & Category are required",
//       });
//     }

//     const files = req.files || [];
//     if (files.length === 0) {
//       return res.status(400).json({ message: "Upload at least 1 image" });
//     }

//     const imageUrls = [];

//     for (const file of files) {
//       const result = await uploadBufferToCloudinary(
//         file.buffer,
//         "admin-products"
//       );
//       imageUrls.push(result.secure_url);
//     }

//     const product = await Product.create({
//       name,
//       brand,
//       description,
//       regularPrice: Number(regularPrice),
//       salePrice: Number(salePrice),
//       category,
//       images: imageUrls,
//       status: "APPROVED", // admin-added product auto approved
//     });

//     res.status(201).json({
//       success: true,
//       message: "Admin Product Added",
//       product,
//     });
//   } catch (error) {
//     console.error("Admin Add Product Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
import Category from "../models/categoryModel.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      regularPrice,
      salePrice,
      category,
    } = req.body;

    if (!name || !regularPrice || !salePrice || !category) {
      return res.status(400).json({
        message: "Name, Regular Price, Sale Price & Category are required",
      });
    }

    /* ================= UPSERT CATEGORY ================= */
    const normalizedCategory = category.trim().toLowerCase();

    await Category.findOneAndUpdate(
      { name: normalizedCategory },
      { $setOnInsert: { name: normalizedCategory, isActive: true } },
      { upsert: true, new: true }
    );

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ message: "Upload at least 1 image" });
    }

    const imageUrls = [];
    for (const file of files) {
      const result = await uploadBufferToCloudinary(
        file.buffer,
        "admin-products"
      );
      imageUrls.push(result.secure_url);
    }

    const product = await Product.create({
      name,
      brand,
      description,
      regularPrice: Number(regularPrice),
      salePrice: Number(salePrice),
      category: normalizedCategory,
      images: imageUrls,
      status: "APPROVED",
    });

    res.status(201).json({
      success: true,
      message: "Admin Product Added",
      product,
    });
  } catch (error) {
    console.error("Admin Add Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Products (CORRECTED to handle both Admin and Seller products)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products: products,   
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};



/* 🔹 Get ALL Orders (Admin) */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
export const getAdminDashboardCounts = async (req, res) => {
  try {
    const users = await User.countDocuments({ isAdmin: false });
    const sellers = await Seller.countDocuments();
    const orders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      users,
      sellers,
      orders,
    });
  } catch (error) {
    console.error("Admin Dashboard Count Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

/* 🔹 BLOCK / UNBLOCK USER */
export const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent blocking admin
    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot block admin" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = "APPROVED";
    await product.save();

    res.json({ success: true, message: "Product approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};
export const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = "REJECTED";
    await product.save();

    res.json({ success: true, message: "Product rejected" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
};
export const toggleBlockProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status =
      product.status === "BLOCKED" ? "APPROVED" : "BLOCKED";

    await product.save();

    res.json({
      success: true,
      message:
        product.status === "BLOCKED"
          ? "Product blocked"
          : "Product unblocked",
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
// 🔹 Get Single Product Details (Admin)
export const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("sellerId", "name email shopName")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product details error:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

/* 🔹 Get Seller Details + Seller Products */
export const getSellerDetails = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const seller = await Seller.findById(sellerId).select("-password");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const products = await Product.find({ sellerId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      seller,
      products,
    });
  } catch (error) {
    console.error("Get Seller Details Error:", error);
    res.status(500).json({ message: "Failed to fetch seller details" });
  }
};

