const Ad = require("../models/Ad");

/**
 * Check whether an ad is currently within its schedule.
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
 * Get all advertisements
 * Owner/Admin panel use.
 */
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .sort({ priority: -1, createdAt: -1 })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role");

    return res.json({
      success: true,
      count: ads.length,
      ads,
    });
  } catch (error) {
    console.error("Get ads error:", error);

    return res.status(500).json({
      success: false,
      message: "विज्ञापन प्राप्त करने में समस्या हुई।",
    });
  }
};

/**
 * Get one advertisement.
 */
exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।",
      });
    }

    return res.json({
      success: true,
      ad,
    });
  } catch (error) {
    console.error("Get ad error:", error);

    return res.status(500).json({
      success: false,
      message: "विज्ञापन प्राप्त करने में समस्या हुई।",
    });
  }
};

/**
 * Get active advertisements for public website.
 */
exports.getPublicAds = async (req, res) => {
  try {
    const { position, device } = req.query;

    const query = {
      isActive: true,
    };

    if (position) {
      query.position = position;
    }

    const ads = await Ad.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    const filteredAds = ads.filter((ad) => {
      if (!isAdScheduled(ad)) {
        return false;
      }

      if (device === "mobile" && !ad.devices?.mobile) {
        return false;
      }

      if (device === "desktop" && !ad.devices?.desktop) {
        return false;
      }

      return true;
    });

    return res.json({
      success: true,
      count: filteredAds.length,
      ads: filteredAds,
    });
  } catch (error) {
    console.error("Get public ads error:", error);

    return res.status(500).json({
      success: false,
      message: "विज्ञापन लोड करने में समस्या हुई।",
    });
  }
};

/**
 * Create advertisement.
 * Route must be protected by ownerOnly middleware.
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
      frequency,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "विज्ञापन का नाम आवश्यक है।",
      });
    }

    const ad = await Ad.create({
      name: name.trim(),
      advertiserName: advertiserName || "",
      adType: adType || "banner",
      position: position || "home_middle",
      devices: {
        desktop:
          devices?.desktop !== undefined
            ? Boolean(devices.desktop)
            : true,
        mobile:
          devices?.mobile !== undefined
            ? Boolean(devices.mobile)
            : true,
      },
      imageUrl: imageUrl || "",
      mobileImageUrl: mobileImageUrl || "",
      videoUrl: videoUrl || "",
      clickUrl: clickUrl || "",
      customCode: customCode || "",
      isActive:
        isActive !== undefined
          ? Boolean(isActive)
          : true,
      startDate: startDate || null,
      endDate: endDate || null,
      priority: Number(priority) || 0,
      frequency: Math.max(Number(frequency) || 1, 1),
      createdBy: req.admin?._id || req.user?._id,
      updatedBy: req.admin?._id || req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "विज्ञापन सफलतापूर्वक बनाया गया।",
      ad,
    });
  } catch (error) {
    console.error("Create ad error:", error);

    return res.status(500).json({
      success: false,
      message: "विज्ञापन बनाने में समस्या हुई।",
    });
  }
};

/**
 * Update advertisement.
 * Route must be protected by ownerOnly middleware.
 */
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।",
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
      "frequency",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        ad[field] = req.body[field];
      }
    });

    if (ad.name) {
      ad.name = ad.name.trim();
    }

    if (ad.priority !== undefined) {
      ad.priority = Number(ad.priority) || 0;
    }

    if (ad.frequency !== undefined) {
      ad.frequency = Math.max(Number(ad.frequency) || 1, 1);
    }

    ad.updatedBy = req.admin?._id || req.user?._id;

    await ad.save();

    return res.json({
      success: true,
      message: "विज्ञापन सफलतापूर्वक अपडेट किया गया।",
      ad,
    });
  } catch (error) {
    console.error("Update ad error:", error);

    return res.status(500).json({
      success: false,
      message: "विज्ञापन अपडेट करने में समस्या हुई।",
    });
  }
};

/**
 * Toggle individual advertisement.
 * Route must be protected by ownerOnly middleware.
 */
exports.toggleAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।",
      });
    }

    ad.isActive = !ad.isActive;
    ad.updatedBy = req.admin?._id || req.user?._id;

    await ad.save();

    return res.json({
      success: true,
      message: ad.isActive
        ? "विज्ञापन चालू कर दिया गया।"
        : "विज्ञापन बंद कर दिया गया।",
      ad,
    });
  } catch (error) {
    console.error("Toggle ad error:", error);

    return res.status(500).json({
      success: false,
      message: "विज्ञापन की स्थिति बदलने में समस्या हुई।",
    });
  }
};

/**
 * Delete advertisement.
 * Route must be protected by ownerOnly middleware.
 */
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।",
      });
    }

    await Ad.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "विज्ञापन सफलतापूर्वक हटाया गया।",
    });
  } catch (error) {
    console.error("Delete ad error:", error);

    return res.status(500).json({
      success: false,
      message: "विज्ञापन हटाने में समस्या हुई।",
    });
  }
};

/**
 * Record an impression.
 */
exports.recordImpression = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressions: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।",
      });
    }

    return res.json({
      success: true,
      impressions: ad.impressions,
    });
  } catch (error) {
    console.error("Record impression error:", error);

    return res.status(500).json({
      success: false,
      message: "Impression record करने में समस्या हुई।",
    });
  }
};

/**
 * Record an ad click.
 */
exports.recordClick = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "विज्ञापन नहीं मिला।",
      });
    }

    return res.json({
      success: true,
      clicks: ad.clicks,
    });
  } catch (error) {
    console.error("Record click error:", error);

    return res.status(500).json({
      success: false,
      message: "Click record करने में समस्या हुई।",
    });
  }
};
