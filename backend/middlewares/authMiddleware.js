
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

/* ================= USER ================= */
export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= ADMIN ================= */
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Admin token missing" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ FIXED LINE
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await User.findById(decoded.id);

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: "Admins only" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err);
    return res.status(401).json({ message: "Invalid admin token" });
  }
};

/* ================= SELLER ================= */
export const verifySeller = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Seller token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const seller = await Seller.findById(decoded.id).select("-password");

    if (!seller) {
      return res.status(401).json({ message: "Seller not found" });
    }

    req.seller = seller;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid seller token" });
  }
};
export const sellerApproved = (req, res, next) => {
  if (req.seller.status !== "APPROVED") {
    return res
      .status(403)
      .json({ message: "Seller not approved by admin" });
  }
  next();
};
