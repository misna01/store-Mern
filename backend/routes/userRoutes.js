

import express from "express";
import { registerUser, loginUser, logoutUser, verifyEmail,updateUserProfile, getUserProfile, changePassword, forgotPassword,verifyForgotOtp, resetPassword } from "../controllers/userController.js";
import { addToCart, getCart,removeCartItem,incrementCartQty,decrementCartQty } from "../controllers/cartController.js";
import { verifyUser } from "../middlewares/authMiddleware.js";
import { getAllProducts, getProductById,getFeaturedProducts , getRelatedProducts} from "../controllers/productController.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { getAllShopBanners } from "../controllers/bannerController.js";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/addressController.js";
import { placeOrder,getOrderById,getUserOrders,updateOrderStatus,cancelOrder} from "../controllers/orderController.js";
import { getWallet } from "../controllers/walletController.js";
import { getShopProducts } from "../controllers/shopController.js";
import { getHomeCategories } from "../controllers/homeController.js";
import { addProductReview } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);

router.get("/home-categories", getHomeCategories);
router.post("/update-profile", verifyUser, updateUserProfile); 
router.get("/profile", verifyUser, getUserProfile);

router.post("/change-password", verifyUser, changePassword);

router.post("/verify-otp", verifyEmail);
router.get("/banners", getAllShopBanners);
router.get("/featured-products", getFeaturedProducts);


router.get("/shop-products", getShopProducts);


router.get("/products", getAllProducts);

router.get("/products/:id", getProductById);

router.get("/related-products", getRelatedProducts);

router.post("/cart/add", verifyUser, addToCart);
router.get("/cart", verifyUser, getCart);
router.delete("/cart/:productId", verifyUser, removeCartItem);
router.put("/cart/increment/:productId", verifyUser, incrementCartQty);
router.put("/cart/decrement/:productId", verifyUser, decrementCartQty);


router.post("/wishlist/add", verifyUser, addToWishlist);
router.get("/wishlist", verifyUser, getWishlist);
router.delete("/wishlist/:productId", verifyUser, removeFromWishlist);

router.get("/addresses", verifyUser, getAddresses);          
router.post("/addresses", verifyUser, addAddress);            
router.put("/addresses/:addressId", verifyUser, updateAddress);  
router.delete("/addresses/:addressId", verifyUser, deleteAddress);

router.post("/orders", verifyUser,placeOrder); 
router.get("/orders/:id", verifyUser, getOrderById);
router.put("/orders/:id/cancel", verifyUser, cancelOrder);


router.get("/orders", verifyUser, getUserOrders);     
router.put("/orders/update-status/:id", updateOrderStatus);

router.get("/wallet", verifyUser, getWallet);


router.post(
  "/products/:id/reviews",verifyUser,addProductReview);


export default router;