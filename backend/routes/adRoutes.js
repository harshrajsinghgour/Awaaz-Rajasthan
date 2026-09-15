"use strict";

const express = require("express");

const {
  getPublicAds,
  recordImpression,
  recordClick
} = require("../controllers/adController");

const router = express.Router();


// ========================================
// PUBLIC ADVERTISEMENT ROUTES
// ========================================


// Get active advertisements
// GET /api/ads
//
// Optional query parameters:
//
// /api/ads?position=home_top
// /api/ads?position=sidebar
// /api/ads?device=mobile
// /api/ads?device=desktop
// /api/ads?position=home_top&device=mobile

router.get(
  "/",
  getPublicAds
);


// ========================================
// AD IMPRESSION
// ========================================

// Record advertisement impression
// POST /api/ads/:id/impression

router.post(
  "/:id/impression",
  recordImpression
);


// ========================================
// AD CLICK
// ========================================

// Record advertisement click
// POST /api/ads/:id/click

router.post(
  "/:id/click",
  recordClick
);


module.exports = router;
