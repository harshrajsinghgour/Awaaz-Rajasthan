"use strict";

const mongoose = require("mongoose");

const Ad = require("../models/Ad");
const AdSettings = require("../models/AdSettings");


/**
 * =========================================================
 * CHECK AD SCHEDULE
 * =========================================================
 *
 * यह check करता है कि Ad की start/end date के
 * अनुसार अभी दिखाया जाना चाहिए या नहीं।
 */
function isAdScheduled(ad) {
  const now = new Date();

  if (ad.startDate && now < new Date(ad.startDate)) {
    return false;
  }

  if (ad.endDate && now > new Date(ad.endDate)) {
    return false;
  }

  return true;
}


/**
 * =========================================================
 * CHECK VALID MONGODB OBJECT ID
 * =========================================================
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}


/**
 * =========================================================
 * GET ALL ADS
 * =========================================================
 *
 * Owner/Admin Panel use.
 *
 * IMPORTANT:
 * Route adminRoutes.js में
 * adminProtect + ownerOnly से protected है।
 */
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .sort({
        priority: -1,
        createdAt: -1
      })
      .populate(
        "createdBy",
        "name email role"
      )
      .populate(
        "updatedBy",
        "name email role"
      );

    return res.json({
      success: true,
      count: ads.length,
      ads
    });

  } catch (error) {
    console.error(
      "Get ads error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन प्राप्त करने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * GET SINGLE AD
 * =========================================================
 *
 * Owner-only panel use.
 */
exports.getAdById = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advertisement ID."
      });
    }

    const ad = await Ad.findById(
      req.params.id
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।"
      });
    }

    return res.json({
      success: true,
      ad
    });

  } catch (error) {
    console.error(
      "Get ad error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन प्राप्त करने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * GET PUBLIC ADS
 * =========================================================
 *
 * Public website के लिए।
 *
 * IMPORTANT:
 *
 * 1. Master adsEnabled check
 * 2. Mobile/Desktop global switch check
 * 3. Individual isActive check
 * 4. Position check
 * 5. Device check
 * 6. Start/End date check
 *
 * Public user कभी भी Ad create/update/delete नहीं कर सकता।
 */
exports.getPublicAds = async (req, res) => {
  try {

    const {
      position,
      device
    } = req.query;


    // =====================================================
    // GET GLOBAL AD SETTINGS
    // =====================================================

    const settings =
      await AdSettings.getSettings();


    // =====================================================
    // MASTER ADS SWITCH
    // =====================================================

    if (!settings.adsEnabled) {
      return res.json({
        success: true,
        count: 0,
        ads: [],
        adsEnabled: false
      });
    }


    // =====================================================
    // DEVICE VALIDATION
    // =====================================================

    if (
      device &&
      !["mobile", "desktop"].includes(device)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "device केवल mobile या desktop हो सकता है।"
      });
    }


    // =====================================================
    // MOBILE GLOBAL SWITCH
    // =====================================================

    if (
      device === "mobile" &&
      !settings.mobileAdsEnabled
    ) {
      return res.json({
        success: true,
        count: 0,
        ads: [],
        adsEnabled: true,
        deviceAdsEnabled: false
      });
    }


    // =====================================================
    // DESKTOP GLOBAL SWITCH
    // =====================================================

    if (
      device === "desktop" &&
      !settings.desktopAdsEnabled
    ) {
      return res.json({
        success: true,
        count: 0,
        ads: [],
        adsEnabled: true,
        deviceAdsEnabled: false
      });
    }


    // =====================================================
    // BASE QUERY
    // =====================================================

    const query = {
      isActive: true
    };


    // =====================================================
    // POSITION FILTER
    // =====================================================

    if (position) {
      query.position = position;
    }


    // =====================================================
    // FETCH ADS
    // =====================================================

    const ads = await Ad.find(query)
      .sort({
        priority: -1,
        createdAt: -1
      })
      .lean();


    // =====================================================
    // FILTER ADS
    // =====================================================

    const filteredAds = ads.filter((ad) => {

      // Individual schedule
      if (!isAdScheduled(ad)) {
        return false;
      }


      // Mobile device
      if (
        device === "mobile" &&
        !ad.devices?.mobile
      ) {
        return false;
      }


      // Desktop device
      if (
        device === "desktop" &&
        !ad.devices?.desktop
      ) {
        return false;
      }


      return true;
    });


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.json({
      success: true,
      count: filteredAds.length,
      ads: filteredAds,
      adsEnabled: true
    });

  } catch (error) {

    console.error(
      "Get public ads error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन लोड करने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * CREATE AD
 * =========================================================
 *
 * IMPORTANT:
 * यह route adminRoutes.js में
 * adminProtect + ownerOnly से protected है।
 *
 * इसलिए केवल OWNER Ad बना सकता है।
 */
exports.createAd = async (req, res) => {
  try {

    const {
      name,
      advertiserName,
      adType,
      position,
      devices,
      imageUrl,
      mobileImageUrl,
      videoUrl,
      clickUrl,
      customCode,
      isActive,
      startDate,
      endDate,
      priority,
      frequency
    } = req.body;


    // =====================================================
    // NAME VALIDATION
    // =====================================================

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "विज्ञापन का नाम आवश्यक है।"
      });
    }


    // =====================================================
    // CREATE AD
    // =====================================================

    const ownerId =
      req.admin?._id ||
      req.user?.id ||
      null;


    const ad = await Ad.create({

      name: name.trim(),

      advertiserName:
        advertiserName || "",

      adType:
        adType || "banner",

      position:
        position || "home_middle",

      devices: {

        desktop:
          devices?.desktop !== undefined
            ? Boolean(devices.desktop)
            : true,

        mobile:
          devices?.mobile !== undefined
            ? Boolean(devices.mobile)
            : true
      },

      imageUrl:
        imageUrl || "",

      mobileImageUrl:
        mobileImageUrl || "",

      videoUrl:
        videoUrl || "",

      clickUrl:
        clickUrl || "",

      customCode:
        customCode || "",

      isActive:
        isActive !== undefined
          ? Boolean(isActive)
          : true,

      startDate:
        startDate || null,

      endDate:
        endDate || null,

      priority:
        Number.isFinite(Number(priority))
          ? Number(priority)
          : 0,

      frequency:
        Math.max(
          Number(frequency) || 1,
          1
        ),

      createdBy:
        ownerId,

      updatedBy:
        ownerId
    });


    return res.status(201).json({
      success: true,
      message:
        "विज्ञापन सफलतापूर्वक बनाया गया।",
      ad
    });

  } catch (error) {

    console.error(
      "Create ad error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन बनाने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * UPDATE AD
 * =========================================================
 *
 * केवल Owner.
 */
exports.updateAd = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid advertisement ID."
      });
    }


    const ad = await Ad.findById(
      req.params.id
    );


    if (!ad) {
      return res.status(404).json({
        success: false,
        message:
          "विज्ञापन नहीं मिला।"
      });
    }


    const allowedFields = [
      "name",
      "advertiserName",
      "adType",
      "position",
      "devices",
      "imageUrl",
      "mobileImageUrl",
      "videoUrl",
      "clickUrl",
      "customCode",
      "isActive",
      "startDate",
      "endDate",
      "priority",
      "frequency"
    ];


    allowedFields.forEach((field) => {

      if (
        req.body[field] !== undefined
      ) {
        ad[field] =
          req.body[field];
      }

    });


    // =====================================================
    // NORMALIZE NAME
    // =====================================================

    if (ad.name) {
      ad.name =
        ad.name.trim();
    }


    // =====================================================
    // NORMALIZE PRIORITY
    // =====================================================

    if (
      ad.priority !== undefined
    ) {
      ad.priority =
        Number(ad.priority) || 0;
    }


    // =====================================================
    // NORMALIZE FREQUENCY
    // =====================================================

    if (
      ad.frequency !== undefined
    ) {
      ad.frequency =
        Math.max(
          Number(ad.frequency) || 1,
          1
        );
    }


    // =====================================================
    // UPDATE USER
    // =====================================================

    ad.updatedBy =
      req.admin?._id ||
      req.user?.id ||
      null;


    await ad.save();


    return res.json({
      success: true,
      message:
        "विज्ञापन सफलतापूर्वक अपडेट किया गया।",
      ad
    });

  } catch (error) {

    console.error(
      "Update ad error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन अपडेट करने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * TOGGLE INDIVIDUAL AD
 * =========================================================
 *
 * केवल Owner.
 */
exports.toggleAd = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid advertisement ID."
      });
    }


    const ad = await Ad.findById(
      req.params.id
    );


    if (!ad) {
      return res.status(404).json({
        success: false,
        message:
          "विज्ञापन नहीं मिला।"
      });
    }


    ad.isActive =
      !ad.isActive;


    ad.updatedBy =
      req.admin?._id ||
      req.user?.id ||
      null;


    await ad.save();


    return res.json({
      success: true,
      message: ad.isActive
        ? "विज्ञापन चालू कर दिया गया।"
        : "विज्ञापन बंद कर दिया गया।",
      ad
    });

  } catch (error) {

    console.error(
      "Toggle ad error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन की स्थिति बदलने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * DELETE AD
 * =========================================================
 *
 * केवल Owner.
 */
exports.deleteAd = async (req, res) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid advertisement ID."
      });
    }


    const ad = await Ad.findById(
      req.params.id
    );


    if (!ad) {
      return res.status(404).json({
        success: false,
        message:
          "विज्ञापन नहीं मिला।"
      });
    }


    await Ad.findByIdAndDelete(
      req.params.id
    );


    return res.json({
      success: true,
      message:
        "विज्ञापन सफलतापूर्वक हटाया गया।"
    });

  } catch (error) {

    console.error(
      "Delete ad error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "विज्ञापन हटाने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * RECORD AD IMPRESSION
 * =========================================================
 *
 * Public route.
 *
 * केवल existing Ad की impression count बढ़ेगी।
 */
exports.recordImpression = async (
  req,
  res
) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid advertisement ID."
      });
    }


    const ad =
      await Ad.findByIdAndUpdate(
        req.params.id,

        {
          $inc: {
            impressions: 1
          }
        },

        {
          new: true
        }
      );


    if (!ad) {
      return res.status(404).json({
        success: false,
        message:
          "विज्ञापन नहीं मिला।"
      });
    }


    return res.json({
      success: true,
      impressions:
        ad.impressions
    });

  } catch (error) {

    console.error(
      "Record impression error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Impression record करने में समस्या हुई।"
    });
  }
};


/**
 * =========================================================
 * RECORD AD CLICK
 * =========================================================
 *
 * Public route.
 *
 * केवल existing Ad की click count बढ़ेगी।
 */
exports.recordClick = async (
  req,
  res
) => {
  try {

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid advertisement ID."
      });
    }


    const ad =
      await Ad.findByIdAndUpdate(
        req.params.id,

        {
          $inc: {
            clicks: 1
          }
        },

        {
          new: true
        }
      );


    if (!ad) {
      return res.status(404).json({
        success: false,
        message:
          "विज्ञापन नहीं मिला।"
      });
    }


    return res.json({
      success: true,
      clicks:
        ad.clicks
    });

  } catch (error) {

    console.error(
      "Record click error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Click record करने में समस्या हुई।"
    });
  }
};
