
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Address from "../models/addressModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";


// const TAX_RATE = 0.1;
// const DELIVERY_CHARGE = 50;
// const FREE_DELIVERY_THRESHOLD = 500;

// const getProductPrice = (product) => {
//   if (!product) return 0;
//   return product.salePrice > 0
//     ? product.salePrice
//     : product.regularPrice;
// };

// export const placeOrder = async (req, res) => {
//   try {
//     /* ================= AUTH ================= */
//     if (!req.user?._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     const userId = req.user._id;
//     const { selectedAddress, paymentMethod, paypalOrderId } = req.body;

//     if (!selectedAddress || !paymentMethod) {
//       return res.status(400).json({
//         success: false,
//         message: "Address and payment method required",
//       });
//     }

//     /* ================= USER ================= */
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     /* ================= CART ================= */
//     const cart = await Cart.findOne({ userId }).populate("items.productId");
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart is empty",
//       });
//     }

//     /* ================= ADDRESS ================= */
//     const address = await Address.findOne({
//       _id: selectedAddress,
//       userId,
//       isActive: true,
//     });

//     if (!address) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid address",
//       });
//     }

//     const shippingAddress = {
//       name: address.name,
//       phone: address.phone,
//       fullAddress: `${address.landmark}, ${address.city}, ${address.state} - ${address.pincode}`,
//       pincode: address.pincode,
//     };

//     /* ================= ITEMS ================= */
//     let subtotal = 0;
//     const orderItems = [];

//     for (const item of cart.items) {
//       const product = item.productId;

//       if (!product) {
//         return res.status(400).json({
//           success: false,
//           message: "Product no longer exists",
//         });
//       }

//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for ${product.name}`,
//         });
//       }

//       const price = getProductPrice(product);
//       const total = price * item.quantity;
//       subtotal += total;

//       orderItems.push({
//         productId: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         priceAtTimeOfOrder: price,
//         total,
//         image: product.images?.[0] || "",
//         brand: product.brand || "",
//       });

//       await Product.updateOne(
//         { _id: product._id },
//         { $inc: { stock: -item.quantity } }
//       );
//     }

//     /* ================= PRICING ================= */
//     const tax = subtotal * TAX_RATE;
//     const deliveryCharge =
//       subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0;

//     const finalTotal = subtotal + tax + deliveryCharge;

//     const pricing = {
//       subtotal: Number(subtotal.toFixed(2)),
//       discount: 0,
//       tax: Number(tax.toFixed(2)),
//       deliveryCharge,
//       finalTotal: Number(finalTotal.toFixed(2)),
//     };

//     /* ================= WALLET ================= */
//     if (paymentMethod === "Wallet") {
//       if (user.walletBalance < pricing.finalTotal) {
//         return res.status(400).json({
//           success: false,
//           message: "Insufficient wallet balance",
//         });
//       }

//       user.walletBalance -= pricing.finalTotal;
//       user.walletHistory.push({
//         type: "DEBIT",
//         amount: pricing.finalTotal,
//         description: "Order payment",
//       });

//       await user.save();
//     }

//     /* ================= STATUS LOGIC (MATCH MODEL ENUM) ================= */
//     let status = "Pending Payment";
//     let isPaid = false;

//     if (paymentMethod === "COD") {
//       status = "Confirmed";
//     }

//     if (paymentMethod === "Wallet") {
//       status = "Confirmed";
//       isPaid = true;
//     }

//     if (paymentMethod === "PayPal") {
//       status = "Confirmed";
//       isPaid = true;
//     }

//     /* ================= CREATE ORDER ================= */
//     const order = await Order.create({
//       userId,
//       orderItems,
//       shippingAddress,
//       pricing,
//       paymentMethod,
//       isPaid,
//       paymentDetails:
//         paymentMethod === "PayPal"
//           ? {
//               orderId: paypalOrderId,
//               status: "Success",
//             }
//           : undefined,
//       status,
//     });

//     /* ================= CLEAR CART ================= */
//     cart.items = [];
//     await cart.save();

//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       orderId: order._id,
//       finalTotal: pricing.finalTotal,
//     });
//   } catch (error) {
//     console.error("PLACE ORDER ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };



const TAX_RATE = 0.1;
const DELIVERY_CHARGE = 50;
const FREE_DELIVERY_THRESHOLD = 500;

export const placeOrder = async (req, res) => {
  try {
    /* ========= AUTH ========= */
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user._id;
    const { selectedAddress, paymentMethod, paypalOrderId } = req.body;

    if (!selectedAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Address & payment method required",
      });
    }

    /* ========= USER ========= */
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    /* ========= CART (WITH SELLER NAME) ========= */
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: {
        path: "sellerId",
        select: "businessName",
      },
    });

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart empty" });
    }

    /* ========= ADDRESS ========= */
    const address = await Address.findOne({
      _id: selectedAddress,
      userId,
      isActive: true,
    });

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address" });
    }

    const shippingAddress = {
      name: address.name,
      phone: address.phone,
      fullAddress: `${address.landmark}, ${address.city}, ${address.state} - ${address.pincode}`,
      pincode: address.pincode,
    };

    /* ========= ITEMS ========= */
    let subtotal = 0;
    const orderItems = [];

   for (const item of cart.items) {
  const product = item.productId;

  if (!product) {
    return res
      .status(400)
      .json({ success: false, message: "Product removed" });
  }

  const price =
    product.salePrice > 0
      ? product.salePrice
      : product.regularPrice;

  // ✅ FIXED: USE quantity
  if (product.quantity < item.quantity) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock for ${product.name}`,
    });
  }

  const sellerName =
    product.sellerId?.businessName || "Admin";

  const total = price * item.quantity;
  subtotal += total;

  orderItems.push({
    productId: product._id,
    sellerId: product.sellerId._id,
    sellerName,
    name: product.name,
    quantity: item.quantity,
    priceAtTimeOfOrder: price,
    total,
    image: product.images?.[0] || "",
    brand: product.brand || "",
  });

  // 🔥 REAL STOCK REDUCTION (FIXED)
  await Product.updateOne(
    { _id: product._id },
    { $inc: { quantity: -item.quantity } }
  );
}

    /* ========= PRICING ========= */
    const tax = subtotal * TAX_RATE;
    const deliveryCharge =
      subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0;

    const finalTotal = subtotal + tax + deliveryCharge;

    const pricing = {
      subtotal,
      tax,
      deliveryCharge,
      finalTotal,
    };

    /* ========= PAYMENT ========= */
    let isPaid = false;
    let status = "Pending Payment";

    if (paymentMethod === "Wallet") {
      if (user.walletBalance < finalTotal) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance",
        });
      }

      user.walletBalance -= finalTotal;
      await user.save();

      isPaid = true;
      status = "Confirmed";
    }

    if (paymentMethod === "COD") {
      status = "Confirmed";
    }

    if (paymentMethod === "PayPal") {
      isPaid = true;
      status = "Confirmed";
    }

    /* ========= CREATE ORDER ========= */
    const order = await Order.create({
      userId,
      orderItems,
      shippingAddress,
      pricing,
      paymentMethod,
      isPaid,
      paymentDetails:
        paymentMethod === "PayPal"
          ? { orderId: paypalOrderId, status: "Success" }
          : undefined,
      status,
    });

    /* ========= CLEAR CART ========= */
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      orderId: order._id,
      finalTotal,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log(`[Fetch Order] Order ID: ${id}, User ID: ${userId}`);

    const order = await Order.findById(id);

    if (!order) {
      console.log('[Fetch Order] Order not found in database');
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // ✅ Check if the authenticated user owns this order
    if (order.userId.toString() !== userId.toString()) {
      console.log('[Fetch Order] User does not own this order');
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to view this order" 
      });
    }

    console.log('[Fetch Order] Order found successfully');
    res.json({ success: true, order });
  } catch (error) {
    console.error('[Fetch Order Error]:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching order" 
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user._id);

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    console.log("ORDERS FOUND:", orders);

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

import Notification from "../models/notificationModel.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    order.status = status;
    await order.save();

    // ✅ CREATE NOTIFICATION WHEN ORDER DELIVERED
    if (status === "Delivered") {
      for (const item of order.orderItems) {
        await Notification.create({
          sellerId: item.sellerId,
          title: "Order Delivered",
          message: `Order ${order._id} has been delivered`,
        });
      }
    }

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (["Cancelled", "Delivered", "Shipped"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    // ✅ REFUND LOGIC
    if (
      ["PayPal", "Wallet"].includes(order.paymentMethod) &&
      order.refundStatus === "None"
    ) {
      const refundAmount = order.pricing.finalTotal;

      user.walletBalance += refundAmount;
      user.walletHistory.push({
        type: "CREDIT",
        amount: refundAmount,
        description: "Refund for cancelled order",
        orderId: order._id,
      });

      order.refundStatus = "Wallet";
      await user.save();
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled & wallet refunded",
      order,
    });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
};


export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller._id; 

    const orders = await Order.find({
      "orderItems.sellerId": sellerId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const sellerOrders = orders.map(order => ({
      _id: order._id,
      shippingAddress: order.shippingAddress,
      pricing: order.pricing,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
      orderItems: order.orderItems.filter(
        item => item.sellerId?.toString() === sellerId.toString()
      ),
    }));

    res.status(200).json({ orders: sellerOrders });
  } catch (error) {
    console.error("SELLER ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};
// export const updateSellerItemStatus = async (req, res) => {
//   try {
//   const sellerId = req.seller._id;

//     const { orderId, productId } = req.params;
//     const { status } = req.body;

//     const allowed = ["Packed", "Shipped", "Delivered"];
//     if (!allowed.includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const item = order.orderItems.find(
//       i =>
//         i.productId.toString() === productId &&
//         i.sellerId.toString() === sellerId.toString()
//     );

//     if (!item) {
//       return res
//         .status(403)
//         .json({ message: "Item not found for this seller" });
//     }

//     // ✅ UPDATE ITEM STATUS
//     item.status = status;

//     // ✅ AUTO UPDATE MAIN ORDER STATUS
//     const allDelivered = order.orderItems.every(
//       i => i.status === "Delivered"
//     );

//     const anyShipped = order.orderItems.some(
//       i => i.status === "Shipped"
//     );

//     const anyPacked = order.orderItems.some(
//       i => i.status === "Packed"
//     );

//     if (allDelivered) {
//       order.status = "Delivered";
//     } else if (anyShipped) {
//       order.status = "Shipped";
//     } else if (anyPacked) {
//       order.status = "Processing";
//     } else {
//       order.status = "Confirmed";
//     }

//     await order.save();

//     res.json({
//       success: true,
//       message: "Item status updated",
//       orderStatus: order.status,
//     });
//   } catch (error) {
//     console.error("SELLER STATUS ERROR:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const updateSellerItemStatus = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { orderId, productId } = req.params;
    const { status } = req.body;

    const allowed = ["Packed", "Shipped", "Delivered"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const item = order.orderItems.find(
      i =>
        i.productId.toString() === productId &&
        i.sellerId.toString() === sellerId.toString()
    );

    if (!item)
      return res.status(403).json({ message: "Item not found" });

    item.status = status;

    /* ---- AUTO ORDER STATUS ---- */
    const allDelivered = order.orderItems.every(
      i => i.status === "Delivered"
    );
    const anyShipped = order.orderItems.some(
      i => i.status === "Shipped"
    );
    const anyPacked = order.orderItems.some(
      i => i.status === "Packed"
    );

    if (allDelivered) order.status = "Delivered";
    else if (anyShipped) order.status = "Shipped";
    else if (anyPacked) order.status = "Processing";
    else order.status = "Confirmed";

    /* 🔔 CREATE NOTIFICATION */
    if (status === "Delivered") {
      await Notification.create({
        sellerId,
        title: "Order Delivered",
        message: `Your product "${item.name}" was delivered`,
      });
    }

    await order.save();

    res.json({ success: true, orderStatus: order.status });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
