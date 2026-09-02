"use strict";

const express = require("express");

const {
  register,
  login,
  me
} = require("../controllers/authController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// PUBLIC AUTH ROUTES
// ========================================

// Register
// POST /api/auth/register
router.post(
  "/register",
  register
);


// Login
// POST /api/auth/login
router.post(
  "/login",
  login
);


// ========================================
// PROTECTED AUTH ROUTES
// ========================================

// Current logged-in user
// GET /api/auth/me
router.get(
  "/me",
  protect,
  me
);


module.exports = router;
