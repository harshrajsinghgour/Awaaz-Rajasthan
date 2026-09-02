"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ========================================
// AUTHENTICATION
// ========================================
// Login के बाद मिले JWT token को verify करता है

const protect = async (req, res, next) => {
  try {
    let token = null;

    // Authorization: Bearer TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. कृपया पहले login करें।"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET server पर configure नहीं है।"
      });
    }

    // Token verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }

    // Database से current user लेना
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account नहीं मिला"
      });
    }

    // Account active है या नहीं
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "आपका account inactive है"
      });
    }

    // Request में user information attach
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();

  } catch (error) {

    // JWT expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Login session expire हो गया है। कृपया दोबारा login करें।"
      });
    }

    // JWT invalid
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }

    next(error);
  }
};


// ========================================
// AUTHORIZATION
// ========================================
// User के role के आधार पर access control

const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "आपको इस action की permission नहीं है"
      });
    }

    next();
  };
};


// ========================================
// ADMIN ONLY
// ========================================

const adminOnly = authorize("admin");


// ========================================
// EDITOR + ADMIN
// ========================================

const editorOnly = authorize(
  "admin",
  "editor"
);


// ========================================
// NEWS TEAM
// ADMIN + EDITOR + REPORTER
// ========================================

const newsTeamOnly = authorize(
  "admin",
  "editor",
  "reporter"
);


module.exports = {
  protect,
  authorize,
  adminOnly,
  editorOnly,
  newsTeamOnly
};
