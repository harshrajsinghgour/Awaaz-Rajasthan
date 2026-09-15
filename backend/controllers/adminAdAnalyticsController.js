"use strict";

const mongoose = require("mongoose");
const Ad = require("../models/Ad");

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

/**
 * Validate MongoDB ObjectId
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}


/**
 * Calculate CTR
 */
function calculateCTR(clicks, impressions) {
  const imp = Number(impressions || 0);
  const clk = Number(clicks || 0);

  if (imp <= 0) {
    return 0;
  }

  return Number(((clk / imp) * 100).toFixed(2));
}


/**
 * Calculate revenue
 */
function calculateRevenue(ad) {
  const billingType = ad.billingType || "fixed";

  const price = Number(ad.price || 0);
  const impressions = Number(ad.impressions || 0);
  const clicks = Number(ad.clicks || 0);

  if (billingType === "cpc") {
    return Number((clicks * price).toFixed(2));
  }

  if (billingType === "cpm") {
    return Number(((impressions / 1000) * price).toFixed(2));
  }

  if (billingType === "fixed") {
    return Number(ad.amountReceived || 0);
  }

  return 0;
}


/* =========================================================
   OVERALL AD ANALYTICS
========================================================= */

/**
 * GET /api/admin/ad-analytics
 *
 * Owner only
 *
 * Returns:
 * - total ads
 * - active ads
 * - inactive ads
 * - impressions
 * - clicks
 * - CTR
 * - revenue
 */
exports.getOverallAnalytics = async (req, res) => {
  try {
    const ads = await Ad.find().lean();

    let totalImpressions = 0;
    let totalClicks = 0;
    let totalRevenue = 0;

    let activeAds = 0;
    let inactiveAds = 0;

    ads.forEach((ad) => {
      totalImpressions += Number(ad.impressions || 0);
      totalClicks += Number(ad.clicks || 0);

      totalRevenue += calculateRevenue(ad);

      if (ad.isActive) {
        activeAds += 1;
      } else {
        inactiveAds += 1;
      }
    });

    return res.json({
      success: true,

      analytics: {
        totalAds: ads.length,
        activeAds,
        inactiveAds,

        totalImpressions,
        totalClicks,

        ctr: calculateCTR(
          totalClicks,
          totalImpressions
        ),

        totalRevenue: Number(
          totalRevenue.toFixed(2)
        ),
      },
    });
  } catch (error) {
    console.error(
      "Overall ad analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन analytics प्राप्त करने में समस्या हुई।",
    });
  }
};


/* =========================================================
   SINGLE AD ANALYTICS
========================================================= */

/**
 * GET /api/admin/ad-analytics/:id
 *
 * Owner only
 */
exports.getAdAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advertisement ID.",
      });
    }

    const ad = await Ad.findById(id)
      .populate(
        "createdBy",
        "name email role"
      )
      .populate(
        "updatedBy",
        "name email role"
      )
      .lean();

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।",
      });
    }

    const impressions = Number(
      ad.impressions || 0
    );

    const clicks = Number(
      ad.clicks || 0
    );

    const ctr = calculateCTR(
      clicks,
      impressions
    );

    const revenue = calculateRevenue(ad);

    const budget = Number(
      ad.budget || 0
    );

    const received = Number(
      ad.amountReceived || 0
    );

    const pendingAmount = Math.max(
      budget - received,
      0
    );

    return res.json({
      success: true,

      analytics: {
        adId: ad._id,

        name: ad.name,

        advertiserName:
          ad.advertiserName || "",

        campaignName:
          ad.campaignName || "",

        adType:
          ad.adType,

        position:
          ad.position,

        status:
          ad.isActive
            ? "active"
            : "inactive",

        campaignStatus:
          ad.campaignStatus,

        impressions,

        clicks,

        ctr,

        billingType:
          ad.billingType,

        price:
          Number(ad.price || 0),

        budget,

        amountReceived:
          received,

        pendingAmount,

        revenue,

        paymentStatus:
          ad.paymentStatus,

        startDate:
          ad.startDate,

        endDate:
          ad.endDate,

        createdAt:
          ad.createdAt,

        updatedAt:
          ad.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Single ad analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन analytics प्राप्त करने में समस्या हुई।",
    });
  }
};


/* =========================================================
   TOP PERFORMING ADS
========================================================= */

/**
 * GET /api/admin/ad-analytics/top
 *
 * Query:
 * ?limit=10
 *
 * Sort by CTR
 */
exports.getTopAds = async (req, res) => {
  try {
    let limit = Number(
      req.query.limit || 10
    );

    if (
      !Number.isFinite(limit) ||
      limit <= 0
    ) {
      limit = 10;
    }

    limit = Math.min(
      Math.floor(limit),
      100
    );

    const ads = await Ad.find()
      .sort({
        clicks: -1,
        impressions: -1,
      })
      .limit(100)
      .lean();

    const rankedAds = ads
      .map((ad) => ({
        ...ad,

        ctr: calculateCTR(
          ad.clicks,
          ad.impressions
        ),

        revenue:
          calculateRevenue(ad),
      }))
      .sort((a, b) => {
        if (b.ctr !== a.ctr) {
          return b.ctr - a.ctr;
        }

        return (
          Number(b.clicks || 0) -
          Number(a.clicks || 0)
        );
      })
      .slice(0, limit);

    return res.json({
      success: true,

      count: rankedAds.length,

      ads: rankedAds,
    });
  } catch (error) {
    console.error(
      "Top ads analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Top advertisements प्राप्त करने में समस्या हुई।",
    });
  }
};


/* =========================================================
   POSITION ANALYTICS
========================================================= */

/**
 * GET /api/admin/ad-analytics/positions
 *
 * Position-wise:
 * - ads
 * - impressions
 * - clicks
 * - CTR
 * - revenue
 */
exports.getPositionAnalytics = async (
  req,
  res
) => {
  try {
    const ads = await Ad.find()
      .select(
        "position impressions clicks billingType price amountReceived"
      )
      .lean();

    const positions = {};

    ads.forEach((ad) => {
      const position =
        ad.position || "unknown";

      if (!positions[position]) {
        positions[position] = {
          position,

          ads: 0,

          impressions: 0,

          clicks: 0,

          revenue: 0,
        };
      }

      positions[position].ads += 1;

      positions[position].impressions +=
        Number(ad.impressions || 0);

      positions[position].clicks +=
        Number(ad.clicks || 0);

      positions[position].revenue +=
        calculateRevenue(ad);
    });

    const result = Object.values(
      positions
    ).map((item) => ({
      ...item,

      ctr: calculateCTR(
        item.clicks,
        item.impressions
      ),

      revenue: Number(
        item.revenue.toFixed(2)
      ),
    }));

    result.sort(
      (a, b) =>
        b.impressions -
        a.impressions
    );

    return res.json({
      success: true,

      count: result.length,

      positions: result,
    });
  } catch (error) {
    console.error(
      "Position analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Position analytics प्राप्त करने में समस्या हुई।",
    });
  }
};


/* =========================================================
   DEVICE ANALYTICS
========================================================= */

/**
 * GET /api/admin/ad-analytics/devices
 *
 * Returns targeted device distribution.
 */
exports.getDeviceAnalytics = async (
  req,
  res
) => {
  try {
    const ads = await Ad.find()
      .select(
        "devices impressions clicks billingType price amountReceived"
      )
      .lean();

    const result = {
      mobile: {
        ads: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
      },

      desktop: {
        ads: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
      },
    };

    ads.forEach((ad) => {
      const devices =
        ad.devices || {};

      if (devices.mobile) {
        result.mobile.ads += 1;

        result.mobile.impressions +=
          Number(ad.impressions || 0);

        result.mobile.clicks +=
          Number(ad.clicks || 0);

        result.mobile.revenue +=
          calculateRevenue(ad);
      }

      if (devices.desktop) {
        result.desktop.ads += 1;

        result.desktop.impressions +=
          Number(ad.impressions || 0);

        result.desktop.clicks +=
          Number(ad.clicks || 0);

        result.desktop.revenue +=
          calculateRevenue(ad);
      }
    });

    result.mobile.ctr =
      calculateCTR(
        result.mobile.clicks,
        result.mobile.impressions
      );

    result.desktop.ctr =
      calculateCTR(
        result.desktop.clicks,
        result.desktop.impressions
      );

    result.mobile.revenue =
      Number(
        result.mobile.revenue.toFixed(2)
      );

    result.desktop.revenue =
      Number(
        result.desktop.revenue.toFixed(2)
      );

    return res.json({
      success: true,
      devices: result,
    });
  } catch (error) {
    console.error(
      "Device analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Device analytics प्राप्त करने में समस्या हुई।",
    });
  }
};
