// import Wishlist from "../models/wishlistModel.js";
// import Product from "../models/productModel.js";

// // Add to Wishlist
// export const addToWishlist = async (req, res) => {
//   try {
// const userId = req.user?._id || req.seller?._id;
//     const { productId } = req.body;

//     if (!userId) return res.status(401).json({ message: "User not authorized" });

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     let wishlist = await Wishlist.findOne({ userId });
//     if (!wishlist) {
//       wishlist = new Wishlist({ userId, items: [{ productId }] });
//     } else {
//       const exists = wishlist.items.find(
//         (item) => item.productId.toString() === productId
//       );
//       if (exists) {
//         return res.status(400).json({ message: "Already in wishlist" });
//       } else {
//         wishlist.items.push({ productId });
//       }
//     }

//     await wishlist.save();
//     res.json({ message: "Wishlist updated", wishlist });
//   } catch (error) {
//     console.error("Add to Wishlist Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get Wishlist
// export const getWishlist = async (req, res) => {
//   try {
// const userId = req.user?._id || req.seller?._id;
//     const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
//     res.json(wishlist || { items: [] });
//   } catch (error) {
//     console.error("Get Wishlist Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Remove from Wishlist
// export const removeFromWishlist = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId } = req.params;

//     const wishlist = await Wishlist.findOne({ userId });
//     if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

//     wishlist.items = wishlist.items.filter(
//       (item) => item.productId.toString() !== productId
//     );
//     await wishlist.save();

//     res.json({ message: "Product removed from wishlist", wishlist });
//   } catch (error) {
//     console.error("Remove Wishlist Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.seller?._id;
    const { productId } = req.body;

    if (!userId)
      return res.status(401).json({ message: "User not authorized" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
    } else {
      const exists = wishlist.items.find(
        (item) => item.productId.toString() === productId
      );
      if (exists) {
        return res.status(400).json({ message: "Already in wishlist" });
      }
      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.json({ message: "Wishlist updated", wishlist });
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.seller?._id;

    if (!userId)
      return res.status(401).json({ message: "User not authorized" });

    const wishlist = await Wishlist.findOne({ userId }).populate(
      "items.productId"
    );

    res.json(wishlist || { items: [] });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from Wishlist ✅ FIXED
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.seller?._id; // ✅ FIX
    const { productId } = req.params;

    if (!userId)
      return res.status(401).json({ message: "User not authorized" });

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    res.json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
