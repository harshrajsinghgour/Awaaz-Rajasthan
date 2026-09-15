"use strict";

const mongoose = require("mongoose");

const adSettingsSchema = new mongoose.Schema(
  {
    // =====================================================
    // MASTER AD SWITCH
    // =====================================================

    adsEnabled: {
      type: Boolean,
      default: true
    },

    // =====================================================
    // OWNER INFORMATION
    // =====================================================

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null
    },

    // =====================================================
    // FUTURE GLOBAL AD SETTINGS
    // =====================================================

    popupEnabled: {
      type: Boolean,
      default: true
    },

    stickyAdEnabled: {
      type: Boolean,
      default: true
    },

    mobileAdsEnabled: {
      type: Boolean,
      default: true
    },

    desktopAdsEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


// =========================================================
// SINGLE SETTINGS DOCUMENT
// =========================================================

adSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.create({
      adsEnabled: true,
      popupEnabled: true,
      stickyAdEnabled: true,
      mobileAdsEnabled: true,
      desktopAdsEnabled: true
    });
  }

  return settings;
};


module.exports = mongoose.model(
  "AdSettings",
  adSettingsSchema
);
