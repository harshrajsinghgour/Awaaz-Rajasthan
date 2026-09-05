"use strict";

const express = require("express");

const {
  getLiveTV,
  getLiveBlog,
  getEPaper,
  getSiteConfig
} = require("../controllers/siteController");

const router = express.Router();


// ========================================
// LIVE TV
// GET /api/site/live-tv
// ========================================

router.get(
  "/live-tv",
  getLiveTV
);


// ========================================
// LIVE BLOG
// GET /api/site/live-blog
// ========================================

router.get(
  "/live-blog",
  getLiveBlog
);


// ========================================
// E-PAPER
// GET /api/site/epaper
// ========================================

router.get(
  "/epaper",
  getEPaper
);


// ========================================
// SITE CONFIG
// GET /api/site/config
// ========================================

router.get(
  "/config",
  getSiteConfig
);


module.exports = router;
