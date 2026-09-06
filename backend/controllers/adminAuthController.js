"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");


// ========================================
// JWT TOKEN
// ========================================

function signAdminToken(admin) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: admin._id.toString(),
      adminId: admin.adminId,
      role: admin.role,
      name: admin.name,

      // IMPORTANT:
      // यह token public user token से अलग रहेगा
      type: "admin",

      // Session invalidate करने के लिए
      tokenVersion: admin.tokenVersion
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
}


// ========================================
// SAFE ADMIN RESPONSE
// ========================================

function publicAdmin(admin) {
  return {
    id: admin._id,
    adminId: admin.adminId,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions:
      admin.role === "owner"
        ? ["*"]
        : admin.permissions || [],
    active: admin.active,
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt
  };
}


// ========================================
// ADMIN LOGIN
// POST /api/admin/login
// ========================================

exports.login = async (req, res, next) => {
  try {
    const { adminId, email, password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    // Admin ID या Email दोनों से login की अनुमति
    const loginId = String(adminId || email || "")
      .trim()
      .toLowerCase();

    if (!loginId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID or email is required"
      });
    }

    // Admin ID uppercase में stored है
    const admin = await AdminUser.findOne({
      $or: [
        { adminId: loginId.toUpperCase() },
        { email: loginId }
      ]
    }).select("+password");

    // Generic message ताकि account enumeration कम हो
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    // Account disabled
    if (!admin.active) {
      return res.status(403).json({
        success: false,
        message: "This admin account is inactive"
      });
    }

    // Password verify
    const passwordValid = await bcrypt.compare(
      String(password),
      admin.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    // Last login update
    admin.lastLoginAt = new Date();
    await admin.save();

    // Admin-specific JWT
    const token = signAdminToken(admin);

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: publicAdmin(admin)
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// GET CURRENT ADMIN
// GET /api/admin/me
// ========================================

exports.me = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required"
      });
    }

    // Fresh database record
    const admin = await AdminUser.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found"
      });
    }

    if (!admin.active) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive"
      });
    }

    return res.json({
      success: true,
      admin: publicAdmin(admin)
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// LOGOUT / INVALIDATE SESSION
// POST /api/admin/logout
// ========================================

exports.logout = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required"
      });
    }

    // Token version बढ़ाने से current token invalid हो जाएगा
    req.admin.tokenVersion += 1;

    await req.admin.save();

    return res.json({
      success: true,
      message: "Admin logged out successfully"
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// CHANGE PASSWORD
// POST /api/admin/change-password
// ========================================

exports.changePassword = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required"
      });
    }

    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters"
      });
    }

    // Password explicitly fetch करें
    const admin = await AdminUser.findById(
      req.admin._id
    ).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found"
      });
    }

    const currentPasswordValid = await bcrypt.compare(
      String(currentPassword),
      admin.password
    );

    if (!currentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // New password directly assign करें.
    // Model का pre-save hook इसे hash करेगा.
    admin.password = String(newPassword);

    // पुराने सभी sessions invalidate
    admin.tokenVersion += 1;

    await admin.save();

    return res.json({
      success: true,
      message:
        "Password changed successfully. Please login again."
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// FORCE LOGOUT ALL SESSIONS
// Owner/Admin द्वारा इस्तेमाल किया जा सकता है
// ========================================

exports.logoutAllSessions = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required"
      });
    }

    req.admin.tokenVersion += 1;

    await req.admin.save();

    return res.json({
      success: true,
      message: "All admin sessions have been invalidated"
    });
  } catch (error) {
    next(error);
  }
};
