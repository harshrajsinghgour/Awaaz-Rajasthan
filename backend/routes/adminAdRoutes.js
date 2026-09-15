"use strict";

const express = require("express");

const {
  getAds,
  getAdById,
  createAd,
  updateAd,
  toggleAd,
  deleteAd
} = require("../controllers/adController");

const {
  adminProtect,
  ownerOnly
} = require("../middleware/adminMiddleware");

const router = express.Router();


// ========================================================
// OWNER AD MANAGEMENT
// ========================================================
//
// सभी routes:
// adminProtect + ownerOnly
//
// इसलिए केवल Owner ही Ads manage कर सकता है.
//
// Normal Admin:
// ❌ Create
// ❌ Update
// ❌ Toggle
// ❌ Delete
//
// Public:
// ❌ कोई management access नहीं
// ========================================================


// ========================================================
// GET ALL ADS
// ========================================================
//
// GET /api/admin/ads

router.get(
  "/",
  adminProtect,
  ownerOnly,
  getAds
);


// ========================================================
// GET SINGLE AD
// ========================================================
//
// GET /api/admin/ads/:id

router.get(
  "/:id",
  adminProtect,
  ownerOnly,
  getAdById
);


// ========================================================
// CREATE AD
// ========================================================
//
// POST /api/admin/ads

router.post(
  "/",
  adminProtect,
  ownerOnly,
  createAd
);


// ========================================================
// UPDATE AD
// ========================================================
//
// PUT /api/admin/ads/:id

router.put(
  "/:id",
  adminProtect,
  ownerOnly,
  updateAd
);


// ========================================================
// TOGGLE AD
// ========================================================
//
// PATCH /api/admin/ads/:id/toggle

router.patch(
  "/:id/toggle",
  adminProtect,
  ownerOnly,
  toggleAd
);


// ========================================================
// DELETE AD
// ========================================================
//
// DELETE /api/admin/ads/:id

router.delete(
  "/:id",
  adminProtect,
  ownerOnly,
  deleteAd
);


module.exports = router;
