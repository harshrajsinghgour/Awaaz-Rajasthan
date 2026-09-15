"use strict";

const express = require("express");

const {
  getAdSettings,
  updateAdSettings
} = require("../controllers/adSettingsController");

const {
  adminProtect,
  ownerOnly
} = require("../middleware/adminMiddleware");

const router = express.Router();


// ========================================================
// OWNER AD SETTINGS
// ========================================================

// Get current Ad Settings
// GET /api/admin/ad-settings
router.get(
  "/",
  adminProtect,
  ownerOnly,
  getAdSettings
);


// Update Ad Settings
// PUT /api/admin/ad-settings
router.put(
  "/",
  adminProtect,
  ownerOnly,
  updateAdSettings
);


module.exports = router;
