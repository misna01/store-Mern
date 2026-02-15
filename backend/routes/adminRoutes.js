// // routes/adminRoutes.js
// import express from "express";
// import multer from "multer";
// import { addBanner, getAllBanners, deleteBanner } from "../controllers/bannerController.js";
// import { getAllProducts,getSellerDetails } from "../controllers/adminController.js";
// import { getAdminPayments,markSellerPaid } from "../controllers/adminPaymentController.js";

// import { addProduct } from "../controllers/adminController.js";
// import { getProductDetails } from "../controllers/adminController.js";

// import { verifyAdmin } from "../middlewares/authMiddleware.js";
// import { loginAdmin,getAllUsers,getAllSellers,getAdminCounts,getAllOrders , getAdminDashboardCounts,toggleBlockUser, approveSeller,rejectSeller,toggleBlockSeller} from "../controllers/adminController.js";
// import {
//   approveProduct,
//   rejectProduct,
//   toggleBlockProduct,
// } from "../controllers/adminController.js";
// const router = express.Router();

// // ✅ Multer setup
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.get("/verify", verifyAdmin, (req, res) => {
//   res.status(200).json({
//     success: true,
//     admin: {
//       id: req.admin._id,
//       name: req.admin.name,
//       email: req.admin.email,
//       isAdmin: req.admin.isAdmin,
//     },
//   });
// });
// router.post("/admin", loginAdmin);
// // ✅ Banner routes
// router.post("/banner", verifyAdmin, upload.single("image"), addBanner);
// router.get("/banners", verifyAdmin, getAllBanners);
// router.delete("/banner/:id", verifyAdmin, deleteBanner);

// // ✅ Product routes
// router.post(
//   "/product",
//   verifyAdmin,
//   upload.array("images", 5),  // <-- IMPORTANT
//   addProduct
// );
// router.get("/products", verifyAdmin, getAllProducts);


// router.get("/counts", verifyAdmin, getAdminCounts);


// router.get("/users", verifyAdmin, getAllUsers);
// router.get("/sellers",verifyAdmin, getAllSellers);
// router.put("/seller/approve/:id", verifyAdmin, approveSeller);
// router.put("/seller/reject/:id", verifyAdmin, rejectSeller);
// router.put("/seller/block/:id", verifyAdmin, toggleBlockSeller);
// router.get("/orders", verifyAdmin, getAllOrders);
// router.get("/dashboard-counts", verifyAdmin, getAdminDashboardCounts);
// router.put( "/users/block/:userId",verifyAdmin, toggleBlockUser);




// router.put("/product/approve/:id", verifyAdmin, approveProduct);
// router.put("/product/reject/:id", verifyAdmin, rejectProduct);
// router.put("/product/block/:id", verifyAdmin, toggleBlockProduct);


// router.get(
//   "/product/:id",
//   verifyAdmin,
//   getProductDetails
// );

// router.get(
//   "/seller/:id",
//   verifyAdmin,
//   getSellerDetails
// );

// router.get("/payments", verifyAdmin, getAdminPayments);
// router.put("/payments/mark-paid", verifyAdmin, markSellerPaid);
// export default router;


// routes/adminRoutes.js
import express from "express";
import multer from "multer";
import { addBanner, getAllBanners, deleteBanner } from "../controllers/bannerController.js";
import { getAllProducts,getSellerDetails } from "../controllers/adminController.js";
import { getAdminPayments,markSellerPaid } from "../controllers/adminPaymentController.js";

import { addProduct } from "../controllers/adminController.js";
import { getProductDetails } from "../controllers/adminController.js";

import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { loginAdmin,getAllUsers,getAllSellers,getAdminCounts,getAllOrders , getAdminDashboardCounts,toggleBlockUser, approveSeller,rejectSeller,toggleBlockSeller} from "../controllers/adminController.js";
import {
  approveProduct,
  rejectProduct,
  toggleBlockProduct,
} from "../controllers/adminController.js";
const router = express.Router();

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/verify", verifyAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      isAdmin: req.admin.isAdmin,
    },
  });
});
router.post("/admin", loginAdmin);
// ✅ Banner routes
router.post("/banner", verifyAdmin, upload.single("image"), addBanner);
router.get("/banners", verifyAdmin, getAllBanners);
router.delete("/banner/:id", verifyAdmin, deleteBanner);

// ✅ Product routes
router.post(
  "/product",
  verifyAdmin,
  upload.array("images", 5),  // <-- IMPORTANT
  addProduct
);
router.get("/products", verifyAdmin, getAllProducts);


router.get("/counts", verifyAdmin, getAdminCounts);


router.get("/users", verifyAdmin, getAllUsers);
router.get("/sellers",verifyAdmin, getAllSellers);
router.put("/seller/approve/:id", verifyAdmin, approveSeller);
router.put("/seller/reject/:id", verifyAdmin, rejectSeller);
router.put("/seller/block/:id", verifyAdmin, toggleBlockSeller);
router.get("/orders", verifyAdmin, getAllOrders);
router.get("/dashboard-counts", verifyAdmin, getAdminDashboardCounts);
router.put( "/users/block/:userId",verifyAdmin, toggleBlockUser);




router.put("/product/approve/:id", verifyAdmin, approveProduct);
router.put("/product/reject/:id", verifyAdmin, rejectProduct);
router.put("/product/block/:id", verifyAdmin, toggleBlockProduct);


router.get(
  "/product/:id",
  verifyAdmin,
  getProductDetails
);

router.get(
  "/seller/:id",
  verifyAdmin,
  getSellerDetails
);

router.get("/payments", verifyAdmin, getAdminPayments);
router.put("/payments/mark-paid", verifyAdmin, markSellerPaid);
export default router;