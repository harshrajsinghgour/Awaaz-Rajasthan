"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT Token बनाना
function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET .env में configure नहीं है");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
}

// User की safe जानकारी
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || "",
    phone: user.phone || ""
  };
}


// ===============================
// REGISTER
// ===============================
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email और password जरूरी हैं"
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name कम से कम 2 characters का होना चाहिए"
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password कम से कम 6 characters का होना चाहिए"
      });
    }

    // Email पहले से मौजूद है या नहीं
    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "इस email से user पहले से मौजूद है"
      });
    }

    /*
      Public registration से कोई user खुद को admin/editor
      नहीं बना सकता। Default role reporter रहेगा।
      
      Password को manually hash नहीं कर रहे हैं,
      क्योंकि User.js का pre-save hook इसे hash करेगा।
    */
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: "reporter"
    });

    return res.status(201).json({
      success: true,
      message: "Registration सफल रहा",
      user: publicUser(user)
    });

  } catch (error) {
    // Duplicate email जैसी MongoDB error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "इस email से user पहले से मौजूद है"
      });
    }

    next(error);
  }
};


// ===============================
// LOGIN
// ===============================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email और password जरूरी हैं"
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // password select:false है, इसलिए +password जरूरी है
    const user = await User.findOne({
      email: cleanEmail
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email या password गलत है"
      });
    }

    // Account active है या नहीं
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "आपका account अभी inactive है"
      });
    }

    // User.js के comparePassword method का उपयोग
    const isPasswordCorrect = await user.comparePassword(
      String(password)
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Email या password गलत है"
      });
    }

    // Last login update
    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: "Login सफल रहा",
      token,
      user: publicUser(user)
    });

  } catch (error) {
    next(error);
  }
};


// ===============================
// CURRENT USER / ME
// ===============================
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User नहीं मिला"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "आपका account inactive है"
      });
    }

    return res.status(200).json({
      success: true,
      user: publicUser(user)
    });

  } catch (error) {
    next(error);
  }
};
