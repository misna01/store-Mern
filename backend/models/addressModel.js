// models/addressModel.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    addressType: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
      trim: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },
    altPhone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Alternative phone must be exactly 10 digits"],
      default: ""
    },
    landmark: {
      type: String,
      required: [true, "Landmark/Address line is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      match: [/^\d{6}$/, "Pincode must be exactly 6 digits"]
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
addressSchema.index({ userId: 1, isActive: 1 });
addressSchema.index({ userId: 1, isDefault: 1 });

// Virtual for full address
addressSchema.virtual('fullAddress').get(function() {
  return `${this.landmark}, ${this.city}, ${this.state} - ${this.pincode}`;
});

// Static method to get user's default address
addressSchema.statics.getDefaultAddress = async function(userId) {
  return await this.findOne({ userId, isDefault: true, isActive: true });
};

// Static method to set default address
addressSchema.statics.setDefaultAddress = async function(userId, addressId) {
  // Remove default from all addresses
  await this.updateMany({ userId }, { isDefault: false });
  // Set new default
  return await this.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });
};

const Address = mongoose.model("Address", addressSchema);

export default Address;