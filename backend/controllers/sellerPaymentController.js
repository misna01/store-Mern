import Order from "../models/orderModel.js";

// export const getSellerPayments = async (req, res) => {
//   try {
//     const sellerId = req.seller._id.toString();
//     const commissionRate = 10; // 10% admin commission

//     const orders = await Order.find({
//       "orderItems.sellerId": sellerId,
//       status: "Delivered", // only completed orders
//     });

//     let totalSales = 0;
//     let adminCommission = 0;
//     let sellerEarnings = 0;
//     let pendingPayout = 0;

//     const sellerOrders = [];

//     orders.forEach((order) => {
//       order.orderItems.forEach((item) => {
//         if (item.sellerId.toString() === sellerId) {
//           totalSales += item.total;

//           const commission = (item.total * commissionRate) / 100;
//           const sellerAmount = item.total - commission;

//           adminCommission += commission;
//           sellerEarnings += sellerAmount;

//           pendingPayout += sellerAmount; // until admin pays

//           sellerOrders.push({
//             orderId: order._id,
//             totalAmount: item.total,
//             productImage: item.image,
//             adminCommission: commission,
//             sellerAmount,
//             payoutStatus: "Pending",
//           });
//         }
//       });
//     });

//     res.json({
//       summary: {
//         totalSales,
//         adminCommission,
//         sellerEarnings,
//         pendingPayout,
//       },
//       orders: sellerOrders,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch payments" });
//   }
// };
export const getSellerPayments = async (req, res) => {
  try {
    const sellerId = req.seller._id.toString();
    const commissionRate = 10;

    const orders = await Order.find({
      "orderItems.sellerId": sellerId,
    });

    let totalSales = 0;
    let adminCommission = 0;
    let sellerEarnings = 0;
    let pendingPayout = 0;

    const sellerOrders = [];

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (
          item.sellerId?.toString() === sellerId &&
          item.status === "Delivered"
        ) {
          const itemTotal = item.total || 0;

          const commission =
            (itemTotal * commissionRate) / 100;

          const sellerAmount = itemTotal - commission;

          totalSales += itemTotal;
          adminCommission += commission;
          sellerEarnings += sellerAmount;

          // ✅ ONLY pending if not paid
          if (item.payoutStatus === "Pending") {
            pendingPayout += sellerAmount;
          }

          sellerOrders.push({
            orderId: order._id,
            totalAmount: itemTotal,
            productImage: item.image,
            adminCommission: commission,
            sellerAmount,
            payoutStatus: item.payoutStatus,
            payoutAt: item.payoutAt,
          });
        }
      });
    });

    res.json({
      summary: {
        totalSales,
        adminCommission,
        sellerEarnings,
        pendingPayout,
      },
      orders: sellerOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
