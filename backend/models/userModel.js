

import mongoose from "mongoose";

/* 🔹 Wallet History Sub-Schema (from 2nd code) */
const walletHistorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* 🔹 User Schema (Combined) */
const userSchema = new mongoose.Schema(
  {
    /* 🔐 Auth & Profile */
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    loginAttempts: {
  type: Number,
  default: 0,
},
lockUntil: {
  type: Date,
},
isBlocked: {
  type: Boolean,
  default: false,
},

loginAttempts: {
  type: Number,
  default: 0,
},

lockUntil: {
  type: Date,
},


    /* 🔐 Roles & Verification */
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
  type: Boolean,
  default: false, // ✅ IMPORTANT
},
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: Number,
    otpExpiry: Date,

    /* 🛒 E-commerce */
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    /* 💰 Wallet */
    walletBalance: {
      type: Number,
      default: 0,
    },
    walletHistory: [walletHistorySchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
