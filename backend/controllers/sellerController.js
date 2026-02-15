import Seller from "../models/sellerModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate token
import nodemailer from "nodemailer";

// ---------- Send OTP Email Helper ----------
const sendOTPEmail = async (email, otp) => {
  console.log(`📩 Sending OTP ${otp} to: ${email}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Seller Password Reset OTP",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  console.log("✔ OTP email sent to seller");
};



// ================= SELLER FORGOT PASSWORD =================
export const sellerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    seller.otp = otp;
    seller.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    await seller.save();
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to seller email", email });
  } catch (err) {
    console.error("SELLER FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// ================= VERIFY SELLER FORGOT OTP =================
export const verifySellerForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const seller = await Seller.findOne({ email });

    console.log("SELLER:", seller);
    console.log("FRONT OTP:", otp);
    console.log("DB OTP:", seller?.otp);

    if (!seller || !seller.otp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (seller.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (seller.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("SELLER VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RESET SELLER PASSWORD =================
export const resetSellerPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.password = await bcrypt.hash(password, 10);
    seller.otp = undefined;
    seller.otpExpiry = undefined;

    await seller.save();

    res.json({ message: "Seller password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ----------------- REGISTER SELLER -----------------
import { uploadBufferToCloudinary } from "../config/uploadToCloudinary.js";

// Register Seller

export const registerSeller = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);
    console.log("Incoming Files:", req.files);

    const files = req.files;
    const documents = {};

    // Upload and save only secure_url
    if (files.panCard) {
      const upload = await uploadBufferToCloudinary(
        files.panCard[0].buffer,
        "sellerDocs/panCard"
      );
      documents.panCard = upload.secure_url;  // << ONLY URL
    }

    if (files.gstCertificate) {
      const upload = await uploadBufferToCloudinary(
        files.gstCertificate[0].buffer,
        "sellerDocs/gstCertificate"
      );
      documents.gstCertificate = upload.secure_url;
    }

    if (files.brandCertificate) {
      const upload = await uploadBufferToCloudinary(
        files.brandCertificate[0].buffer,
        "sellerDocs/brandCertificate"
      );
      documents.brandCertificate = upload.secure_url;
    }

    if (files.addressProof) {
      const upload = await uploadBufferToCloudinary(
        files.addressProof[0].buffer,
        "sellerDocs/addressProof"
      );
      documents.addressProof = upload.secure_url;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create seller in DB
    const seller = await Seller.create({
      ...req.body,
      password: hashedPassword,
      documents,
      status: "PENDING",
    });

    // Generate token
    const token = generateToken(seller._id);

    res.status(201).json({
      message: "Seller registered successfully",
      role: "seller",
      token,
      seller: {
        id: seller._id,
        fullName: seller.fullName,
        email: seller.email,
        status: seller.status,
      },
    });

  } catch (err) {
    console.error("SELLER REG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ----------------- GET SELLER PROFILE -----------------
export const getSellerProfile = async (req, res) => {
  res.json(req.seller);
};


export const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    // allowed text updates
    const allowed = [
      "fullName",
      "phone",
      "businessAddress",
      "city",
      "state",
      "storeName"
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        seller[field] = req.body[field];
      }
    });

    // document replacement
    if (req.files?.panCard) {
      const upload = await uploadBufferToCloudinary(
        req.files.panCard[0].buffer,
        "sellerDocs/pan"
      );
      seller.documents.panCard = upload.secure_url;
    }

    if (req.files?.gstCertificate) {
      const upload = await uploadBufferToCloudinary(
        req.files.gstCertificate[0].buffer,
        "sellerDocs/gst"
      );
      seller.documents.gstCertificate = upload.secure_url;
    }

    if (req.files?.brandCertificate) {
      const upload = await uploadBufferToCloudinary(
        req.files.brandCertificate[0].buffer,
        "sellerDocs/brand"
      );
      seller.documents.brandCertificate = upload.secure_url;
    }

    if (req.files?.addressProof) {
      const upload = await uploadBufferToCloudinary(
        req.files.addressProof[0].buffer,
        "sellerDocs/address"
      );
      seller.documents.addressProof = upload.secure_url;
    }

    await seller.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
export const logoutUser = async (req, res) => {
  try {
    console.log("🚪 User logged out");

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
      });

      return res.status(200).json({ message: "Logged out successfully" });
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

import Notification from "../models/notificationModel.js";

export const getSellerNotificationsCount = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const unreadCount = await Notification.countDocuments({
      sellerId,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
export const updateSellerItemStatus = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { orderId, productId } = req.params;
    const { status } = req.body;

    const allowed = ["Packed", "Shipped", "Delivered"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const item = order.orderItems.find(
      i =>
        i.productId.toString() === productId &&
        i.sellerId.toString() === sellerId.toString()
    );

    if (!item)
      return res.status(403).json({ message: "Item not found" });

    item.status = status;

    /* ---- AUTO ORDER STATUS ---- */
    const allDelivered = order.orderItems.every(
      i => i.status === "Delivered"
    );
    const anyShipped = order.orderItems.some(
      i => i.status === "Shipped"
    );
    const anyPacked = order.orderItems.some(
      i => i.status === "Packed"
    );

    if (allDelivered) order.status = "Delivered";
    else if (anyShipped) order.status = "Shipped";
    else if (anyPacked) order.status = "Processing";
    else order.status = "Confirmed";

    /* 🔔 CREATE NOTIFICATION */
    if (status === "Delivered") {
      await Notification.create({
        sellerId,
        title: "Order Delivered",
        message: `Your product "${item.name}" was delivered`,
      });
    }

    await order.save();

    res.json({ success: true, orderStatus: order.status });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
