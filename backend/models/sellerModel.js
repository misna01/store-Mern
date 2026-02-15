
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,

    sellerType: String,
    businessName: String,
    businessAddress: String,
    pinCode: String,
    city: String,
    state: String,
    gst: String,
    pan: String,

    bankAccount: String,
    ifsc: String,
    storeName: String,

    documents: {
      panCard: String,
      gstCertificate: String,
      brandCertificate: String,
      addressProof: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "BLOCKED"],
      default: "PENDING",
    },
    loginAttempts: {
  type: Number,
  default: 0,
},
lockUntil: {
  type: Date,
},

    otp: Number,
otpExpiry: Date,

  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
