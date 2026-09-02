"use strict";

const express = require("express");

const {
  getNews,
  getNewsById,
  searchNews,
  getBreakingNews,
  getTrendingNews,
  getNewsByCategory,
  getNewsByDistrict,
  createNews,
  updateNews,
  deleteNews
} = require("../controllers/newsController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ========================================
// PUBLIC ROUTES
// ========================================

// Search News
// GET /api/news/search?q=राजस्थान
router.get("/search", searchNews);


// Breaking News
// GET /api/news/breaking
router.get("/breaking", getBreakingNews);


// Trending News
// GET /api/news/trending
router.get("/trending", getTrendingNews);


// Category News
// GET /api/news/category/:category
router.get(
  "/category/:category",
  getNewsByCategory
);


// District News
// GET /api/news/district/:district
router.get(
  "/district/:district",
  getNewsByDistrict
);


// All News
// GET /api/news
router.get("/", getNews);


// Single News
// GET /api/news/:id
router.get("/:id", getNewsById);


// ========================================
// PROTECTED ROUTES
// ========================================

// Create News
// POST /api/news
// Admin + Editor + Reporter
router.post(
  "/",
  protect,
  authorize("admin", "editor", "reporter"),
  upload.single("image"),
  createNews
);


// Update News
// PUT /api/news/:id
// Admin + Editor + Reporter
router.put(
  "/:id",
  protect,
  authorize("admin", "editor", "reporter"),
  upload.single("image"),
  updateNews
);


// Delete News
// DELETE /api/news/:id
// केवल Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteNews
);


module.exports = router;
