import Order from "../models/orderModel.js";

const COMMISSION_RATE = 10;

// ================================
// GET ALL SELLER PAYMENTS (ADMIN)
// ================================
// export const getAdminPayments = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("orderItems.sellerId", "name email");

//     const payments = [];
//     let totalAdminCommission = 0;
//     let totalSellerPayable = 0;

//     orders.forEach((order) => {
//       order.orderItems.forEach((item) => {
//         console.log("DEBUG ITEM:", {
//           status: item.status,
//           sellerId: item.sellerId,
//           total: item.total,
//         });

//         if (
//           item.status?.toLowerCase() === "delivered" &&
//           item.sellerId
//         ) {
//           const itemTotal =
//             item.total || item.price * item.qty || 0;

//           const commission =
//             (itemTotal * COMMISSION_RATE) / 100;

//           const sellerAmount = itemTotal - commission;

//           const payoutStatus = item.payoutStatus || "Pending";

//           totalAdminCommission += commission;

//           if (payoutStatus === "Pending") {
//             totalSellerPayable += sellerAmount;
//           }

//           payments.push({
//             orderId: order._id,
//             sellerId: item.sellerId._id,
//             sellerName: item.sellerName || item.sellerId.name,
//             totalAmount: itemTotal,
//             commission,
//             sellerAmount,
//             payoutStatus,
//             payoutAt: item.payoutAt,
//             createdAt: order.createdAt,
//           });
//         }
//       });
//     });

//     console.log("FINAL PAYMENTS:", payments.length);

//     res.json({
//       summary: {
//         totalAdminCommission,
//         totalSellerPayable,
//       },
//       payments,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch admin payments" });
//   }
// };

export const getAdminPayments = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("orderItems.sellerId", "businessName email");

    const payments = [];
    let totalAdminCommission = 0;
    let totalSellerPayable = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (
          item.status === "Delivered" &&
          item.sellerId
        ) {
          const itemTotal = item.total || 0;

          const commission =
            (itemTotal * COMMISSION_RATE) / 100;

          const sellerAmount = itemTotal - commission;

          const payoutStatus = item.payoutStatus || "Pending";

          totalAdminCommission += commission;

          // ✅ ONLY unpaid seller amount
          if (payoutStatus === "Pending") {
            totalSellerPayable += sellerAmount;
          }

          payments.push({
            orderId: order._id,
            sellerId: item.sellerId._id,
            sellerName:
              item.sellerName || item.sellerId.businessName,
            totalAmount: itemTotal,
            commission,
            sellerAmount,
            payoutStatus,
            payoutAt: item.payoutAt,
            createdAt: order.createdAt,
          });
        }
      });
    });

    res.json({
      summary: {
        totalAdminCommission,
        totalSellerPayable,
      },
      payments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin payments" });
  }
};

// ================================
// MARK SELLER PAID (ADMIN)
// ================================
export const markSellerPaid = async (req, res) => {
  try {
    const { orderId, sellerId } = req.body;

    console.log("MARK PAID REQUEST:", { orderId, sellerId });

    if (!orderId || !sellerId) {
      return res.status(400).json({ message: "orderId or sellerId missing" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.orderItems.find(
      (i) => i.sellerId && i.sellerId.toString() === sellerId
    );

    if (!item) {
      return res.status(404).json({
        message: "Seller item not found for this order",
      });
    }

    item.payoutStatus = "Paid";
    item.payoutAt = new Date();

    await order.save();

    res.json({ success: true, message: "Seller payout marked as PAID" });
  } catch (err) {
    console.error("MARK PAID ERROR:", err);
    res.status(500).json({
      message: err.message || "Failed to mark payout",
    });
  }
};
