"use strict";


// ========================================
// LIVE TV
// GET /api/site/live-tv
// ========================================

exports.getLiveTV = async (req, res, next) => {
  try {
    const liveTV = {
      enabled:
        process.env.LIVE_TV_ENABLED === "true",

      title:
        process.env.LIVE_TV_TITLE ||
        "आवाज राजस्थान LIVE",

      streamUrl:
        process.env.LIVE_TV_URL ||
        "",

      youtubeUrl:
        process.env.LIVE_TV_YOUTUBE_URL ||
        "",

      thumbnail:
        process.env.LIVE_TV_THUMBNAIL ||
        "",

      status:
        process.env.LIVE_TV_STATUS ||
        "offline"
    };

    return res.status(200).json({
      success: true,
      liveTV
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// LIVE BLOG
// GET /api/site/live-blog
// ========================================

exports.getLiveBlog = async (req, res, next) => {
  try {
    /*
      फिलहाल Live Blog को static configuration
      से serve किया जा रहा है।

      बाद में इसे MongoDB collection से जोड़कर
      real-time admin updates भी किए जा सकते हैं।
    */

    const liveBlog = {
      enabled:
        process.env.LIVE_BLOG_ENABLED === "true",

      title:
        process.env.LIVE_BLOG_TITLE ||
        "राजस्थान LIVE अपडेट",

      description:
        process.env.LIVE_BLOG_DESCRIPTION ||
        "राजस्थान की बड़ी खबरों और ताजा अपडेट पर नजर रखें।",

      lastUpdated:
        new Date().toISOString(),

      updates: []
    };

    return res.status(200).json({
      success: true,
      liveBlog
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// E-PAPER
// GET /api/site/epaper
// ========================================

exports.getEPaper = async (req, res, next) => {
  try {
    const epaper = {
      enabled:
        process.env.EPAPER_ENABLED === "true",

      title:
        process.env.EPAPER_TITLE ||
        "आवाज राजस्थान E-Paper",

      date:
        process.env.EPAPER_DATE ||
        new Date().toISOString().split("T")[0],

      pdfUrl:
        process.env.EPAPER_PDF_URL ||
        "",

      thumbnail:
        process.env.EPAPER_THUMBNAIL ||
        "",

      downloadEnabled:
        process.env.EPAPER_DOWNLOAD_ENABLED !== "false"
    };

    return res.status(200).json({
      success: true,
      epaper
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// SITE CONFIG
// GET /api/site/config
// ========================================

exports.getSiteConfig = async (req, res, next) => {
  try {
    const config = {
      siteName:
        process.env.SITE_NAME ||
        "आवाज राजस्थान",

      tagline:
        process.env.SITE_TAGLINE ||
        "राजस्थान की हर खबर, सबसे पहले",

      logo:
        process.env.SITE_LOGO ||
        "",

      website:
        process.env.SITE_URL ||
        "",

      liveTV:
        process.env.LIVE_TV_ENABLED === "true",

      liveBlog:
        process.env.LIVE_BLOG_ENABLED === "true",

      epaper:
        process.env.EPAPER_ENABLED === "true"
    };

    return res.status(200).json({
      success: true,
      config
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getLiveTV,
  getLiveBlog,
  getEPaper,
  getSiteConfig
};
