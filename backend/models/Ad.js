"use strict";

const mongoose = require("mongoose");

/* =========================================================
   ADVERTISEMENT SCHEMA
========================================================= */

const adSchema = new mongoose.Schema(
  {
    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    advertiserName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    campaignName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    /* =====================================================
       ADVERTISEMENT TYPE
    ===================================================== */

    adType: {
      type: String,
      enum: [
        "banner",
        "image",
        "video",
        "popup",
        "sticky",
        "in_article",
        "native",
        "custom",
      ],
      default: "banner",
      index: true,
    },

    /* =====================================================
       ADVERTISEMENT POSITION
    ===================================================== */

    position: {
      type: String,
      enum: [
        "header",
        "home_top",
        "home_middle",
        "home_bottom",
        "news_detail_top",
        "news_detail_middle",
        "news_detail_bottom",
        "sidebar",
        "video",
        "live_tv",
        "epaper",
        "footer",
        "popup",
        "sticky_bottom",
        "custom",
      ],
      default: "home_middle",
      index: true,
    },

    customPosition: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    /* =====================================================
       DEVICE TARGETING
    ===================================================== */

    devices: {
      desktop: {
        type: Boolean,
        default: true,
      },

      mobile: {
        type: Boolean,
        default: true,
      },
    },

    /* =====================================================
       CREATIVE / MEDIA
    ===================================================== */

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    mobileImageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    videoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    clickUrl: {
      type: String,
      trim: true,
      default: "",
    },

    customCode: {
      type: String,
      default: "",
    },

    /* =====================================================
       STATUS
    ===================================================== */

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /* =====================================================
       SCHEDULING
    ===================================================== */

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    /* =====================================================
       PRIORITY
    ===================================================== */

    priority: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =====================================================
       FREQUENCY CONTROL
    ===================================================== */

    frequency: {
      type: Number,
      default: 1,
      min: 1,
    },

    frequencyUnit: {
      type: String,
      enum: [
        "view",
        "session",
        "minute",
        "hour",
        "day",
      ],
      default: "view",
    },

    /* =====================================================
       POPUP / STICKY CONTROL
    ===================================================== */

    showPopupOnce: {
      type: Boolean,
      default: true,
    },

    stickyEnabled: {
      type: Boolean,
      default: false,
    },

    closeButtonEnabled: {
      type: Boolean,
      default: true,
    },

    /* =====================================================
       ANALYTICS COUNTERS
    ===================================================== */

    impressions: {
      type: Number,
      default: 0,
      min: 0,
    },

    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =====================================================
       REVENUE / BILLING
    ===================================================== */

    billingType: {
      type: String,
      enum: [
        "free",
        "fixed",
        "cpc",
        "cpm",
      ],
      default: "fixed",
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    budget: {
      type: Number,
      default: 0,
      min: 0,
    },

    amountReceived: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: [
        "not_required",
        "pending",
        "partial",
        "paid",
      ],
      default: "not_required",
    },

    paymentReference: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    /* =====================================================
       CAMPAIGN STATUS
    ===================================================== */

    campaignStatus: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "running",
        "paused",
        "completed",
        "cancelled",
      ],
      default: "draft",
    },

    /* =====================================================
       OWNER INFORMATION
    ===================================================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: false,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   INDEXES
========================================================= */

adSchema.index({
  isActive: 1,
  position: 1,
  priority: -1,
});

adSchema.index({
  startDate: 1,
  endDate: 1,
});

adSchema.index({
  adType: 1,
  position: 1,
});

adSchema.index({
  campaignStatus: 1,
});

adSchema.index({
  advertiserName: 1,
});

adSchema.index({
  paymentStatus: 1,
});


/* =========================================================
   VIRTUAL CTR
========================================================= */

adSchema.virtual("ctr").get(function () {
  if (!this.impressions || this.impressions <= 0) {
    return 0;
  }

  return Number(
    ((this.clicks / this.impressions) * 100).toFixed(2)
  );
});


/* =========================================================
   VIRTUAL PENDING AMOUNT
========================================================= */

adSchema.virtual("pendingAmount").get(function () {
  const budget = Number(this.budget || 0);
  const received = Number(this.amountReceived || 0);

  return Math.max(budget - received, 0);
});


/* =========================================================
   JSON VIRTUALS
========================================================= */

adSchema.set("toJSON", {
  virtuals: true,
});

adSchema.set("toObject", {
  virtuals: true,
});


/* =========================================================
   MODEL
========================================================= */

module.exports = mongoose.model("Ad", adSchema);
