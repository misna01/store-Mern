
import express from "express";
import { uploadSellerDocs } from "../config/multerSeller.js"; // your existing seller docs multer
import multerProduct from "../config/multerProduct.js";
import { registerSeller,getSellerProfile,updateSellerProfile,logoutUser, sellerForgotPassword,
  verifySellerForgotOtp,
  resetSellerPassword} from "../controllers/sellerController.js";
import { addProduct, getSellerProducts,editProduct,getSellerProductById, addOffer, removeOffer,toggleProductStatus,toggleFeatureProduct,searchSellerProducts,toggleListProduct } from "../controllers/productController.js";
import { verifySeller,sellerApproved,} from "../middlewares/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from "../controllers/wishlistController.js";

import { getSellerPayments } from "../controllers/sellerPaymentController.js";
import {
  getUnreadCount,
  getNotifications,
  markAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

import {
  addToCart,
  getCart,
  removeCartItem,
  incrementCartQty,
  decrementCartQty
} from "../controllers/cartController.js";
import { getSellerOrders,updateSellerItemStatus } from "../controllers/orderController.js";
import { getSellerDashboard } from "../controllers/sellerDashboardController.js";

/* ADD THIS BELOW YOUR EXISTING ROUTES */

router.post("/cart/add", verifySeller, addToCart);
router.get("/cart", verifySeller, getCart);
router.delete("/cart/remove/:productId", verifySeller, removeCartItem);
router.put("/cart/inc/:productId", verifySeller, incrementCartQty);
router.put("/cart/dec/:productId", verifySeller, decrementCartQty);


// Seller registration (existing)
router.post("/register", uploadSellerDocs, registerSeller);

router.post(
  "/add-product",
  verifySeller,
  sellerApproved,
  multerProduct.array("images", 5),
  addProduct
);



router.get("/my-products", verifySeller, getSellerProducts);
router.get("/profile", verifySeller, getSellerProfile);


router.put(
  "/update-profile",
  verifySeller,
  uploadSellerDocs,
  updateSellerProfile
);
router.put(
  "/edit-product/:id",
  verifySeller,
  multerProduct.array("images", 5),
  editProduct
);

router.get(
  "/product/:id",
  verifySeller,
  getSellerProductById
);
router.post("/add-offer", verifySeller, addOffer);
router.post("/remove-offer", verifySeller, removeOffer);

router.patch("/toggle-status/:id", verifySeller, toggleProductStatus);
router.patch("/toggle-feature/:id", verifySeller, toggleFeatureProduct);
router.get("/search-products", verifySeller, searchSellerProducts);

router.get("/seller-orders", verifySeller, getSellerOrders);
router.put(
  "/order/:orderId/item/:productId/status",
  verifySeller,
  updateSellerItemStatus
);

router.get("/dashboard",  verifySeller, getSellerDashboard);
// ===== SELLER WISHLIST =====
router.post("/wishlist/add", verifySeller, addToWishlist);
router.get("/wishlist", verifySeller, getWishlist);
router.delete("/wishlist/:productId", verifySeller, removeFromWishlist);

router.post("/logout", logoutUser);
router.patch(
  "/toggle-list/:id",
  verifySeller,
   
  toggleListProduct
);
router.get("/payments", verifySeller, getSellerPayments);
router.put(
  "/order/:orderId/item/:productId/status",
  verifySeller,
  updateSellerItemStatus
);
router.get(
  "/notifications/count",
  verifySeller,
  getUnreadCount
);

router.get(
  "/notifications",
  verifySeller,
  getNotifications
);

router.put(
  "/notifications/read",
  verifySeller,
  markAsRead
);
router.post("/forgot-password", sellerForgotPassword);
router.post("/verify-forgot-otp", verifySellerForgotOtp);
router.post("/reset-password", resetSellerPassword);

export default router;