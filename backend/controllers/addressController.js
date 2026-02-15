import Address from "../models/addressModel.js";
import User from "../models/userModel.js"; // Assuming you have a User model for error checking

/**
 * @desc Get all addresses for the logged-in user
 * @route GET /api/user/addresses
 * @access Private (verifyUser middleware required)
 */
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from verifyUser middleware

    const addresses = await Address.find({ userId, isActive: true }).sort({ isDefault: -1, createdAt: 1 });

    if (!addresses) {
      return res.status(404).json({ message: "No addresses found for this user." });
    }

    res.status(200).json({
      message: "Addresses fetched successfully",
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Server error while fetching addresses." });
  }
};

/**
 * @desc Add a new address for the user
 * @route POST /api/user/addresses
 * @access Private
 */
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from verifyUser middleware
    const { addressType, name, phone, altPhone, landmark, city, state, pincode, isDefault } = req.body;

    // 1. Check if the user already has addresses
    const addressCount = await Address.countDocuments({ userId, isActive: true });
    
    // Set the first address as default automatically if no other addresses exist
    const shouldBeDefault = addressCount === 0 || isDefault === true;

    // 2. If the new address is marked as default, unset default for all others
    if (shouldBeDefault) {
      await Address.updateMany({ userId, isDefault: true }, { $set: { isDefault: false } });
    }
    
    // 3. Create the new address
    const newAddress = new Address({
      userId,
      addressType,
      name,
      phone,
      altPhone,
      landmark,
      city,
      state,
      pincode,
      isDefault: shouldBeDefault, // Use the calculated default value
    });

    const savedAddress = await newAddress.save();

    res.status(201).json({
      message: "Address added successfully",
      address: savedAddress,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Server error while adding address." });
  }
};

/**
 * @desc Update an existing address
 * @route PUT /api/user/addresses/:addressId
 * @access Private
 */
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const updateData = req.body;

    // Ensure the user owns the address and it exists
    const existingAddress = await Address.findOne({ _id: addressId, userId, isActive: true });

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found or unauthorized." });
    }

    // Special handling for `isDefault` field
    if (updateData.isDefault === true) {
      // Unset default for all other addresses of this user
      await Address.updateMany({ userId, isDefault: true, _id: { $ne: addressId } }, { $set: { isDefault: false } });
    } else if (updateData.isDefault === false && existingAddress.isDefault) {
      // If the user tries to unset the default address, we should prevent it 
      // or ensure another address is set as default, but for now, we'll allow the update
      // and let the client handle ensuring a default exists for checkout.
    }

    // Update the address document
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated doc and run schema validators
    );

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Server error while updating address." });
  }
};

/**
 * @desc Delete an address (soft delete by setting isActive to false)
 * @route DELETE /api/user/addresses/:addressId
 * @access Private
 */
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    // Check if the user owns the address and it exists
    const addressToDelete = await Address.findOne({ _id: addressId, userId, isActive: true });

    if (!addressToDelete) {
      return res.status(404).json({ message: "Address not found or unauthorized." });
    }
    
    // Soft delete the address
    const result = await Address.findByIdAndUpdate(
      addressId,
      { $set: { isActive: false, isDefault: false } }, // Also remove default status
      { new: true }
    );

    // If the deleted address was the default one, try to set another address as default
    if (addressToDelete.isDefault) {
        const nextAddress = await Address.findOneAndUpdate(
            { userId, isActive: true }, // Find any other active address
            { $set: { isDefault: true } },
            { new: true, sort: { createdAt: 1 } } // Set the oldest active address as the new default
        );
    }


    res.status(200).json({
      message: "Address deleted successfully",
      addressId: addressId,
    });

  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error while deleting address." });
  }
};