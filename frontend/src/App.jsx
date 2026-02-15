

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// /* ================= USER ================= */
// import Home from "./pages/User/Home";
// // import Home from "./pages/User/HomeBootstrap";

// import Shop from "./pages/User/Shop";
// import ProductDetails from "./pages/User/ProductDetails";
// import Cart from "./pages/User/Cart";
// import Checkout from "./pages/User/Checkout";
// import OrderSuccess from "./pages/User/OrderSuccess";
// import OrderDetails from "./pages/User/OrderDetails";
// import Wishlist from "./pages/User/Wishlist";
// import About from "./pages/User/About";
// import Contact from "./pages/User/Contact";
// import Profile from "./pages/User/Profile";

// /* ================= AUTH ================= */
// import Login from "./pages/Auth/Login";
// import Signup from "./pages/Auth/Signup";
// import VerifyOtp from "./pages/Auth/VerifyOtp";
// import ForgotPassword from "./pages/Auth/ForgotPassword";
// import VerifyForgotOtp from "./pages/Auth/VerifyForgotOtp";
// import ResetPassword from "./pages/Auth/ResetPassword";

// /* ================= SELLER ================= */
// import SellerLayout from "./components/seller/SellerLayout";
// import SellerDashboard from "./pages/Seller/SellerDashboard";
// import SellerProfile from "./pages/Seller/SellerProfile";
// import EditSellerProfile from "./pages/Seller/EditSellerProfile";
// import SellerOrders from "./pages/Seller/SellerOrders";
// import AddProducts from "./pages/Seller/AddProducts";
// import ProductList from "./pages/Seller/ProductList";
// import ManageProducts from "./pages/Seller/ManageProducts";
// import EditProduct from "./pages/Seller/EditProduct";
// import SellerRegistration from "./pages/Seller/SellerRegistration";
// import SellerPayments from "./pages/Seller/SellerPayments";


// /* ================= ADMIN ================= */
// import AdminLogin from "./pages/Admin/AdminLogin";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import Users from "./pages/Admin/Users";
// import Sellers from "./pages/Admin/Sellers";
// import AdminOrders from "./pages/Admin/AdminOrders";
// import SellerDetails from "./pages/Admin/SellerDetails";
// import AdminPayments from "./pages/Admin/AdminPayments";
// import ProtectedAdminRoute from "./protect/ProtectedAdminRoute";



// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* ========== AUTH ROUTES ========== */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/verify-forgot-otp" element={<VerifyForgotOtp />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* ========== USER ROUTES ========== */}
//         <Route path="/" element={<Home />} />
//         <Route path="/shop" element={<Shop />} />
//         <Route path="/product/:id" element={<ProductDetails />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/order-success" element={<OrderSuccess />} />
//         <Route path="/orders/:id" element={<OrderDetails />} />
//         <Route path="/wishlist" element={<Wishlist />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/user/profile" element={<Profile />} />

//         {/* ========== SELLER LOGIN (NO LAYOUT) ========== */}
//         <Route path="/seller/login" element={<SellerRegistration />} />

//         {/* ========== SELLER PANEL (WITH LAYOUT & SIDEBAR) ========== */}
//        <Route path="/seller" element={<SellerLayout />}>
//   <Route path="dashboard" element={<SellerDashboard />} />
//   <Route path="profile" element={<SellerProfile />} />
//   <Route path="edit-profile" element={<EditSellerProfile />} />
//   <Route path="orders" element={<SellerOrders />} />
//   <Route path="add-product" element={<AddProducts />} />
//   <Route path="my-products" element={<ProductList />} />
//   <Route path="manage-products" element={<ManageProducts />} />
//   <Route path="edit-product/:id" element={<EditProduct />} />
//   <Route path="/seller/payments" element={<SellerPayments />} />
// </Route>


//         {/* ========== ADMIN ROUTES ========== */}
//         <Route path="/admin" element={<AdminLogin />} />
//         {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        

// <Route
//   path="/admin/dashboard"
//   element={
//     <ProtectedAdminRoute>
//       <AdminDashboard />
//     </ProtectedAdminRoute>
//   }
// />
//         <Route path="/users" element={<Users />} />
//         <Route path="/sellers" element={<Sellers />} />
//         <Route path="/admin/orders" element={<AdminOrders />} />
//                 <Route path="/admin/payments" element={<AdminPayments />} />

//         <Route path="/admin/sellers/:id" element={<SellerDetails />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;

// // // https://www.figma.com/make/g1Zpe1KQc6zNsT0PVDDHi3/Short-Form-Blogging-App?node-id=0-4&t=xqaycle1lrYENyBi-1
// // //https://www.figma.com/make/JSavXdQnNvZlIWblYP5Xcg/Virtual-Pet-App?node-id=0-1&p=f&t=2HCrOwtxWKEEAqxl-0
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= USER ================= */
import Home from "./pages/User/Home";
import Shop from "./pages/User/Shop";
import ProductDetails from "./pages/User/ProductDetails";
import Cart from "./pages/User/Cart";
import Checkout from "./pages/User/Checkout";
import OrderSuccess from "./pages/User/OrderSuccess";
import OrderDetails from "./pages/User/OrderDetails";
import Wishlist from "./pages/User/Wishlist";
import About from "./pages/User/About";
import Contact from "./pages/User/Contact";
import Profile from "./pages/User/Profile";

/* ================= AUTH ================= */
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyForgotOtp from "./pages/Auth/VerifyForgotOtp";
import ResetPassword from "./pages/Auth/ResetPassword";

/* ================= SELLER ================= */
import SellerLayout from "./components/seller/SellerLayout";
import SellerDashboard from "./pages/Seller/SellerDashboard";
import SellerProfile from "./pages/Seller/SellerProfile";
import EditSellerProfile from "./pages/Seller/EditSellerProfile";
import SellerOrders from "./pages/Seller/SellerOrders";
import AddProducts from "./pages/Seller/AddProducts";
import ProductList from "./pages/Seller/ProductList";
import ManageProducts from "./pages/Seller/ManageProducts";
import EditProduct from "./pages/Seller/EditProduct";
import SellerRegistration from "./pages/Seller/SellerRegistration";
import SellerPayments from "./pages/Seller/SellerPayments";

/* ================= ADMIN ================= */
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "./pages/Admin/Users";
import Sellers from "./pages/Admin/Sellers";
import AdminOrders from "./pages/Admin/AdminOrders";
import SellerDetails from "./pages/Admin/SellerDetails";
import AdminPayments from "./pages/Admin/AdminPayments";
import ProtectedAdminRoute from "./protect/ProtectedAdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* ========== AUTH ROUTES ========== */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-forgot-otp" element={<VerifyForgotOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ========== USER ROUTES ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user/profile" element={<Profile />} />

        {/* ========== SELLER LOGIN ========== */}
        <Route path="/seller/login" element={<SellerRegistration />} />

        {/* ========== SELLER PANEL ========== */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="edit-profile" element={<EditSellerProfile />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="add-product" element={<AddProducts />} />
          <Route path="my-products" element={<ProductList />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="payments" element={<SellerPayments />} />
        </Route>

        {/* ========== ADMIN LOGIN ========== */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ========== ADMIN PANEL (PROTECTED) ========== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <Users />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/sellers"
          element={
            <ProtectedAdminRoute>
              <Sellers />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedAdminRoute>
              <AdminPayments />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/sellers/:id"
          element={
            <ProtectedAdminRoute>
              <SellerDetails />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
