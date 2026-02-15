

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";
import nodemailer from "nodemailer";

// ----------------- Generate Token -----------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ================= USER LOGIN ================= */
    const user = await User.findOne({ email });

    if (user) {
      // Admin block check
      if (user.isBlocked) {
        return res.status(403).json({
          message: "Your account has been blocked by admin",
        });
      }

      // 🔒 Brute-force lock check
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(429).json({
          message: "Too many failed attempts. Try again after some time",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        user.loginAttempts += 1;

        if (user.loginAttempts >= 5) {
          user.lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
          user.loginAttempts = 0;
        }

        await user.save();
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // ✅ success → reset lock
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        role: "user",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    /* ================= SELLER LOGIN ================= */
    const seller = await Seller.findOne({ email });

    if (seller) {
      // Seller status check
      if (seller.status !== "APPROVED") {
        const statusMessages = {
          PENDING: "Your seller account is pending admin approval",
          REJECTED: "Your seller account was rejected by admin",
          BLOCKED: "Your seller account has been blocked by admin",
        };

        return res.status(403).json({
          message: statusMessages[seller.status] || "Seller login denied",
        });
      }

      // 🔒 Brute-force lock check (seller)
      if (seller.lockUntil && seller.lockUntil > Date.now()) {
        return res.status(429).json({
          message: "Too many failed attempts. Try again after some time",
        });
      }

      const isMatch = await bcrypt.compare(password, seller.password);

      if (!isMatch) {
        seller.loginAttempts += 1;

        if (seller.loginAttempts >= 5) {
          seller.lockUntil = Date.now() + 5 * 60 * 1000;
          seller.loginAttempts = 0;
        }

        await seller.save();
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // ✅ success → reset lock
      seller.loginAttempts = 0;
      seller.lockUntil = null;
      await seller.save();

      const token = generateToken(seller._id);

      return res.status(200).json({
        role: "seller",
        token,
        seller: {
          id: seller._id,
          fullName: seller.fullName,
          email: seller.email,
          status: seller.status,
        },
      });
    }

    /* ================= NO ACCOUNT ================= */
    return res.status(404).json({
      message: "No account found with this email",
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// ----------------- LOGOUT USER -----------------
export const logoutUser = async (req, res) => {
  try {
    console.log("🚪 User logged out");

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
      });

      return res.status(200).json({ message: "Logged out successfully" });
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- Send OTP Email Helper ----------
const sendOTPEmail = async (email, otp) => {
  console.log(`📩 Sending OTP ${otp} to: ${email}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  console.log("✔ OTP email sent");
};

// ----------------- REGISTER USER (FIXED TO HANDLE FIRSTNAME & LASTNAME) -----------------
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    console.log("📝 Registration data received:", { firstName, lastName, email });

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    if (firstName.trim().length < 2) {
      return res.status(400).json({ 
        message: "First name must be at least 2 characters" 
      });
    }

    if (lastName.trim().length < 2) {
      return res.status(400).json({ 
        message: "Last name must be at least 2 characters" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Check if user already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already used" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    console.log("Generated OTP:", otp);

    // Save TEMP DATA in session (including firstName and lastName)
    req.session.tempUser = { 
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email, 
      password 
    };
    req.session.otp = otp;
    req.session.otpExpiry = otpExpiry;

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to your email",
      email,
    });

  } catch (err) {
    console.error("REGISTER USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ----------------- VERIFY EMAIL (FIXED TO SAVE FIRSTNAME & LASTNAME) -----------------
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!req.session.otp || !req.session.tempUser) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (parseInt(otp) !== parseInt(req.session.otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (req.session.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const temp = req.session.tempUser;

    console.log("✅ Creating user with:", { 
      firstName: temp.firstName, 
      lastName: temp.lastName, 
      email: temp.email 
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(temp.password, 10);

    // Create new user with firstName and lastName
    // 🔥 IMPORTANT: Map firstName to 'name' field since that's what your schema requires
    const newUser = new User({
      name: temp.firstName,        // Map firstName to 'name' field
      lastName: temp.lastName,
      email: temp.email,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    console.log("✅ User created successfully:", newUser._id);

    const token = generateToken(newUser._id);

    // Clear session
    delete req.session.otp;
    delete req.session.otpExpiry;
    delete req.session.tempUser;

    return res.json({
      message: "OTP verified and account created successfully",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.name,      // Send as firstName
        lastName: newUser.lastName,
        email: newUser.email,
        role: "user"
      }
    });

  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ----------------- UPDATE USER PROFILE -----------------
// export const updateUserProfile = async (req, res) => {
//   try {
//     const userId = req.user._id; 
//     const { firstName, lastName, phone } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     let hasChanges = false;

//     // Update First Name (mapped to 'name' in DB)
//     if (firstName !== undefined && firstName !== user.name) {
//       user.name = firstName;
//       user.markModified('name'); 
//       hasChanges = true;
//     }
    
//     // Update Last Name
//     if (lastName !== undefined && lastName !== user.lastName) {
//       user.lastName = lastName;
//       user.markModified('lastName'); 
//       hasChanges = true;
//     }
    
//     // Update Phone Number
//     if (phone !== undefined && phone !== user.phone) {
//       user.phone = phone;
//       user.markModified('phone'); 
//       hasChanges = true;
//     }

//     if (!hasChanges) {
//       return res.status(200).json({ 
//         success: true, 
//         message: "No changes detected, profile remains the same." 
//       });
//     }

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: {
//         id: user._id,
//         firstName: user.name,      // Return as firstName
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         role: "user"
//       },
//     });
//   } catch (error) {
//     console.error("UPDATE PROFILE ERROR:", error);
//     res.status(500).json({ success: false, message: "Server error updating profile" });
//   }
// };
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, phone } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let hasChanges = false;

    // Update First Name (mapped to 'name' in DB)
    if (firstName && firstName.trim() !== (user.name || "").trim()) {
      user.name = firstName.trim();
      user.markModified("name");
      hasChanges = true;
    }

    // Update Last Name
    if (lastName && lastName.trim() !== (user.lastName || "").trim()) {
      user.lastName = lastName.trim();
      user.markModified("lastName");
      hasChanges = true;
    }

    // Update Phone
    if (phone && phone.trim() !== (user.phone || "").trim()) {
      user.phone = phone.trim();
      user.markModified("phone");
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(200).json({
        success: true,
        message: "No changes detected, profile remains the same.",
        user: {
          id: user._id,
          firstName: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role || "user",
        },
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

// GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        firstName: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role || "user",
        id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- CHANGE PASSWORD -----------------
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Server error changing password" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

    await user.save();
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to email", email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const verifyForgotOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.otp) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (user.otp !== Number(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ message: "OTP verified successfully" });
};
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(password, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};
