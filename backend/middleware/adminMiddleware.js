"use strict";

const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");


// ========================================
// ADMIN AUTHENTICATION
// ========================================
// Admin/Owner token verify करेगा
// ========================================

const adminProtect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin authorization token missing"
      });
    }

    const token = header.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authorization token missing"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured"
      });
    }

    // JWT verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token admin token होना चाहिए
    if (decoded.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token"
      });
    }

    // Database से actual Admin/Owner निकालना
    const admin = await AdminUser.findById(decoded.id).select(
      "+password"
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found"
      });
    }

    // Deactivated account
    if (!admin.active) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive"
      });
    }

    // Token version check
    if (
      typeof decoded.tokenVersion === "number" &&
      decoded.tokenVersion !== admin.tokenVersion
    ) {
      return res.status(401).json({
        success: false,
        message: "Admin session has expired. Please login again"
      });
    }

    // Request में admin information
    req.admin = admin;

    // Compatibility के लिए req.user भी
    req.user = {
      id: admin._id.toString(),
      adminId: admin.adminId,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (error) {
    console.error("Admin authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin token expired. Please login again"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Admin authentication failed"
    });
  }
};


// ========================================
// OWNER ONLY
// ========================================
// केवल Owner access कर सकता है
// ========================================

const ownerOnly = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required"
    });
  }

  if (req.admin.role !== "owner") {
    return res.status(403).json({
      success: false,
      message: "Owner access required"
    });
  }

  next();
};


// ========================================
// ROLE CHECK
// ========================================
// Example:
// requireAdminRole("owner", "admin")
// ========================================

const requireAdminRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required"
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action"
      });
    }

    next();
  };
};


// ========================================
// PERMISSION CHECK
// ========================================
// Owner = हमेशा allowed
// Admin = केवल assigned permission
//
// Example:
// requirePermission("news.create")
// ========================================

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required"
      });
    }

    // Owner को full control
    if (req.admin.role === "owner") {
      return next();
    }

    // Admin की permission check
    if (
      !Array.isArray(req.admin.permissions) ||
      !req.admin.permissions.includes(permission)
    ) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${permission}`
      });
    }

    next();
  };
};


// ========================================
// MULTIPLE PERMISSIONS
// ========================================
// mode = "any"
// इनमें से कोई एक permission हो तो access
//
// mode = "all"
// सभी permissions जरूरी
// ========================================

const requirePermissions = (permissions = [], mode = "any") => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required"
      });
    }

    // Owner = Full Control
    if (req.admin.role === "owner") {
      return next();
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No permissions configured"
      });
    }

    const adminPermissions = Array.isArray(req.admin.permissions)
      ? req.admin.permissions
      : [];

    let allowed = false;

    if (mode === "all") {
      allowed = permissions.every((permission) =>
        adminPermissions.includes(permission)
      );
    } else {
      allowed = permissions.some((permission) =>
        adminPermissions.includes(permission)
      );
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You do not have the required permission"
      });
    }

    next();
  };
};


module.exports = {
  adminProtect,
  ownerOnly,
  requireAdminRole,
  requirePermission,
  requirePermissions
};
