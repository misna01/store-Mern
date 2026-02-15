
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },

    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },

    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    description: { type: String, trim: true },

    regularPrice: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    colors: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      required: true,
    },

    /* 🔥 OFFER */
    offer: {
      type: Number, // percentage (10,20...)
      default: 0,
    },

    /* 🔥 FEATURE */
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
  type: String,
  enum: ["PENDING", "APPROVED", "REJECTED", "BLOCKED"],
  default: "PENDING",
},


isListed: {
  type: Boolean,
  default: true,
},
brand: {
  type: String,
  required: true,
  trim: true,
},


    isBlocked: {
      type: Boolean,
      default: false,
    },
    reviews: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String }, // user name
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, trim: true },
  },
],

averageRating: {
  type: Number,
  default: 0,
},

numReviews: {
  type: Number,
  default: 0,
},

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
