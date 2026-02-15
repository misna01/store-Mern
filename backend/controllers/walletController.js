import User from "../models/userModel.js";

export const getWallet = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user._id).select(
      "walletBalance walletHistory"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      wallet: {
        balance: user.walletBalance || 0,
        history: user.walletHistory || [],
      },
    });
  } catch (error) {
    console.error("Wallet fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet",
    });
  }
};
