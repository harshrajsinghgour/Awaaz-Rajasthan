"use strict";

const express = require("express");

const {
    getAdAnalytics,
    getSingleAdAnalytics
} = require("../controllers/adAnalyticsController");

const {
    adminProtect,
    ownerOnly
} = require("../middleware/adminMiddleware");

const router = express.Router();


/* ========================================================
   OWNER AD ANALYTICS
======================================================== */

/*
   IMPORTANT:

   ये सभी routes केवल Owner के लिए हैं।

   Admin:
   ❌ Access denied

   Public:
   ❌ Access denied

   Owner:
   ✅ Full Analytics Access
*/


/* ========================================================
   GET ALL AD ANALYTICS
======================================================== */

/*
   GET /api/admin/ad-analytics

   इसमें मिलेगा:

   - Total Ads
   - Active Ads
   - Inactive Ads
   - Total Impressions
   - Total Clicks
   - Overall CTR
   - Best Ads by Clicks
   - Best Ads by Impressions
   - Best Ads by CTR
   - Position-wise Analytics
*/

router.get(
    "/",
    adminProtect,
    ownerOnly,
    getAdAnalytics
);


/* ========================================================
   GET SINGLE AD ANALYTICS
======================================================== */

/*
   GET /api/admin/ad-analytics/:id

   किसी एक Advertisement की performance:

   - Impressions
   - Clicks
   - CTR
   - Position
   - Ad Type
   - Active Status
   - Priority
   - Start Date
   - End Date
*/

router.get(
    "/:id",
    adminProtect,
    ownerOnly,
    getSingleAdAnalytics
);


/* ========================================================
   EXPORT ROUTER
======================================================== */

module.exports = router;
