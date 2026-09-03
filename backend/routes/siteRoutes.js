"use strict";

const express = require("express");

const {
  getLiveTV,
  getLiveBlog,
  getEPaper
} = require("../controllers/siteController");

const router = express.Router();


// ========================================
// LIVE TV
// ========================================

// GET /api/site/live-tv
router.get(
  "/live-tv",
  getLiveTV
);


// ========================================
// LIVE BLOG
// ========================================

// GET /api/site/live-blog
router.get(
  "/live-blog",
  getLiveBlog
);


// ========================================
// E-PAPER
// ========================================

// GET /api/site/epaper
router.get(
  "/epaper",
  getEPaper
);


module.exports = router;
