"use strict";

const express = require("express");

const {
  adminProtect,
  ownerOnly,
} = require("../middleware/adminMiddleware");

const {
  getOverallAnalytics,
  getAdAnalytics,
  getTopAds,
  getPositionAnalytics,
  getDeviceAnalytics,
} = require("../controllers/adminAdAnalyticsController");

const router = express.Router();


/* =========================================================
   OWNER-ONLY AD ANALYTICS
========================================================= */

/*
  इस पूरे route को केवल Owner access कर सकता है।

  Normal Admin:
  ❌ Analytics access नहीं

  Public User:
  ❌ Analytics access नहीं

  Owner:
  ✅ Full Analytics
*/


router.use(
  adminProtect,
  ownerOnly
);


/* =========================================================
   OVERALL ANALYTICS
========================================================= */

/*
  GET /api/admin/ad-analytics

  इसमें मिलेगा:

  - Total Ads
  - Active Ads
  - Inactive Ads
  - Total Impressions
  - Total Clicks
  - Overall CTR
  - Total Revenue
*/

router.get(
  "/",
  getOverallAnalytics
);


/* =========================================================
   TOP PERFORMING ADS
========================================================= */

/*
  GET /api/admin/ad-analytics/top

  Optional:

  ?limit=10

  Example:

  /api/admin/ad-analytics/top?limit=20

  इसमें सबसे अच्छा perform करने वाले
  advertisements मिलेंगे।
*/

router.get(
  "/top",
  getTopAds
);


/* =========================================================
   POSITION ANALYTICS
========================================================= */

/*
  GET /api/admin/ad-analytics/positions

  Position-wise analytics:

  - Header
  - Home Top
  - Home Middle
  - Sidebar
  - News
  - Footer
  - Popup
  - Sticky
  - आदि
*/

router.get(
  "/positions",
  getPositionAnalytics
);


/* =========================================================
   DEVICE ANALYTICS
========================================================= */

/*
  GET /api/admin/ad-analytics/devices

  Device-wise analytics:

  - Mobile
  - Desktop

  Data:

  - Ads
  - Impressions
  - Clicks
  - CTR
  - Revenue
*/

router.get(
  "/devices",
  getDeviceAnalytics
);


/* =========================================================
   SINGLE AD ANALYTICS
========================================================= */

/*
  GET /api/admin/ad-analytics/:id

  किसी एक advertisement की पूरी analytics।

  Example:

  /api/admin/ad-analytics/AD_ID
*/

router.get(
  "/:id",
  getAdAnalytics
);


/* =========================================================
   EXPORT
========================================================= */

module.exports = router;
