const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    // Basic information
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

    // Advertisement type
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
    },

    // Advertisement placement
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
    },

    // Desktop / mobile control
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

    // Creative
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

    // Ad HTML/code if required in future
    customCode: {
      type: String,
      default: "",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Scheduling
    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    // Priority
    priority: {
      type: Number,
      default: 0,
    },

    // Frequency control
    frequency: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Analytics
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

    // Owner information
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

// Useful indexes
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

module.exports = mongoose.model("Ad", adSchema);
