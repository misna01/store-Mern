
import mongoose from "mongoose";

/* ---------------- ORDER ITEM ---------------- */
// const orderItemSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },

//     sellerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     sellerName: {
//       type: String,
//       required: true,
//     },

//     name: String,
//     image: String,
//     brand: String,

//     quantity: Number,
//     priceAtTimeOfOrder: Number,
//     total: Number,

//     status: {
//       type: String,
//       enum: ["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
//       default: "Confirmed",
//     },

//     // ✅ MUST BE HERE (NOT in main order)
//     payoutStatus: {
//       type: String,
//       enum: ["Pending", "Paid"],
//       default: "Pending",
//     },

//     payoutAt: {
//       type: Date,
//     },
//   },
//   { _id: false }
// );
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ✅ CORRECT MODEL
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: false, // admin products
    },

    sellerName: {
      type: String,
      required: true,
    },

    name: String,
    image: String,
    brand: String,

    quantity: Number,
    priceAtTimeOfOrder: Number,
    total: Number,

    status: {
      type: String,
      enum: ["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Confirmed",
    },

    payoutStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    payoutAt: Date,
  },
  { _id: false }
);
 
/* ---------------- PRICING ---------------- */
const pricingSchema = new mongoose.Schema(
  {
    subtotal: Number,
    discount: { type: Number, default: 0 },
    tax: Number,
    deliveryCharge: Number,
    finalTotal: Number,
  },
  { _id: false }
);

/* ---------------- SHIPPING ADDRESS ---------------- */
const shippingAddressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    fullAddress: String,
    pincode: String,
  },
  { _id: false }
);

/* ---------------- MAIN ORDER ---------------- */
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: shippingAddressSchema,

    pricing: pricingSchema,

    paymentMethod: {
      type: String,
      enum: ["COD", "Wallet", "PayPal"],
      required: true,
    },

    paymentDetails: {
      orderId: String,
      status: {
        type: String,
        enum: ["Success", "Pending", "Failed"],
        default: "Pending",
      },
    },

    status: {
      type: String,
      enum: [
        "Pending Payment",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending Payment",
    },

    refundStatus: {
      type: String,
      enum: ["None", "Wallet"],
      default: "None",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
