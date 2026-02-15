import Notification from "../models/notificationModel.js";

/* 🔴 UNREAD COUNT */
export const getUnreadCount = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const count = await Notification.countDocuments({
      sellerId,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

/* 📩 GET ALL NOTIFICATIONS */
export const getNotifications = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const notifications = await Notification.find({ sellerId })
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ✅ MARK AS READ */
export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { sellerId: req.seller._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};
