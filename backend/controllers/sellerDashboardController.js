import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.seller._id; // ✅ FIXED

    const totalProducts = await Product.countDocuments({ sellerId });

    const orders = await Order.find({
      "orderItems.sellerId": sellerId,
    });

    const totalOrders = orders.length;

    let pendingOrders = 0;
    let deliveredOrders = 0;
    let totalRevenue = 0;
    let todaysSales = 0;

    const today = new Date().toDateString();

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.sellerId.toString() === sellerId.toString()) {
          if (item.status === "Delivered") {
            deliveredOrders++;
            totalRevenue += item.total;

            if (new Date(order.createdAt).toDateString() === today) {
              todaysSales += item.total;
            }
          } else if (item.status !== "Cancelled") {
            pendingOrders++;
          }
        }
      });
    });

    res.json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        todaysSales,
      },
    });
  } catch (error) {
    console.error("Seller dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

