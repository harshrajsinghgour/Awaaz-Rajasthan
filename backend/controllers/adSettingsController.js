"use strict";

const AdSettings = require("../models/AdSettings");


// =========================================================
// GET AD SETTINGS
// OWNER ONLY
// =========================================================

const getAdSettings = async (req, res) => {
  try {
    const settings = await AdSettings.getSettings();

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error("Get ad settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Ad settings प्राप्त करने में समस्या हुई।"
    });
  }
};


// =========================================================
// UPDATE AD SETTINGS
// OWNER ONLY
// =========================================================

const updateAdSettings = async (req, res) => {
  try {
    const {
      adsEnabled,
      popupEnabled,
      stickyAdEnabled,
      mobileAdsEnabled,
      desktopAdsEnabled
    } = req.body;


    const settings = await AdSettings.getSettings();


    // -----------------------------------------------------
    // MASTER ADS SWITCH
    // -----------------------------------------------------

    if (adsEnabled !== undefined) {
      if (typeof adsEnabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "adsEnabled केवल true या false होना चाहिए।"
        });
      }

      settings.adsEnabled = adsEnabled;
    }


    // -----------------------------------------------------
    // POPUP ADS
    // -----------------------------------------------------

    if (popupEnabled !== undefined) {
      if (typeof popupEnabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "popupEnabled केवल true या false होना चाहिए।"
        });
      }

      settings.popupEnabled = popupEnabled;
    }


    // -----------------------------------------------------
    // STICKY ADS
    // -----------------------------------------------------

    if (stickyAdEnabled !== undefined) {
      if (typeof stickyAdEnabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "stickyAdEnabled केवल true या false होना चाहिए।"
        });
      }

      settings.stickyAdEnabled = stickyAdEnabled;
    }


    // -----------------------------------------------------
    // MOBILE ADS
    // -----------------------------------------------------

    if (mobileAdsEnabled !== undefined) {
      if (typeof mobileAdsEnabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "mobileAdsEnabled केवल true या false होना चाहिए।"
        });
      }

      settings.mobileAdsEnabled = mobileAdsEnabled;
    }


    // -----------------------------------------------------
    // DESKTOP ADS
    // -----------------------------------------------------

    if (desktopAdsEnabled !== undefined) {
      if (typeof desktopAdsEnabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "desktopAdsEnabled केवल true या false होना चाहिए।"
        });
      }

      settings.desktopAdsEnabled = desktopAdsEnabled;
    }


    // -----------------------------------------------------
    // WHO UPDATED SETTINGS
    // -----------------------------------------------------

    settings.updatedBy = req.admin._id;


    await settings.save();


    return res.status(200).json({
      success: true,
      message: "Ad settings सफलतापूर्वक अपडेट हो गईं।",
      settings
    });

  } catch (error) {
    console.error("Update ad settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Ad settings अपडेट करने में समस्या हुई।"
    });
  }
};


module.exports = {
  getAdSettings,
  updateAdSettings
};
