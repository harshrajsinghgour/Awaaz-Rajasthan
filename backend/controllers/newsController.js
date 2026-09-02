"use strict";

const News = require("../models/News");


// ========================================
// Helper: Boolean Value
// ========================================
function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return ["true", "1", "yes", "on"].includes(
    String(value).toLowerCase()
  );
}


// ========================================
// Helper: Tags
// ========================================
function parseTags(tags) {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags
      .map(tag => String(tag).trim())
      .filter(Boolean);
  }

  return String(tags)
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);
}


// ========================================
// GET ALL NEWS
// GET /api/news
// ========================================
exports.getNews = async (req, res, next) => {
  try {
    const {
      category,
      district,
      location,
      trending,
      breaking,
      featured,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const perPage = Math.min(
      Math.max(parseInt(limit, 10) || 20, 1),
      100
    );

    const filter = {
      isPublished: true
    };

    // Category filter
    if (category && category !== "all") {
      filter.category = category;
    }

    // District filter
    if (district) {
      filter.district = district;
    }

    // Location filter
    if (location) {
      filter.location = {
        $regex: String(location),
        $options: "i"
      };
    }

    // Trending
    if (trending !== undefined) {
      filter.isTrending = toBoolean(trending);
    }

    // Breaking
    if (breaking !== undefined) {
      filter.isBreaking = toBoolean(breaking);
    }

    // Featured
    if (featured !== undefined) {
      filter.isFeatured = toBoolean(featured);
    }

    // Search
    if (search && String(search).trim()) {
      filter.$text = {
        $search: String(search).trim()
      };
    }

    const skip = (currentPage - 1) * perPage;

    const [news, total] = await Promise.all([
      News.find(filter)
        .sort({
          publishedAt: -1,
          createdAt: -1
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      News.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      count: news.length,
      total,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(total / perPage),
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET SINGLE NEWS
// GET /api/news/:id
// ========================================
exports.getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findOne({
      _id: id,
      isPublished: true
    }).lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News नहीं मिली"
      });
    }

    // View count बढ़ाना
    await News.updateOne(
      { _id: id },
      { $inc: { views: 1 } }
    );

    news.views = (news.views || 0) + 1;

    return res.status(200).json({
      success: true,
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// SEARCH NEWS
// GET /api/news/search?q=
// ========================================
exports.searchNews = async (req, res, next) => {
  try {
    const query = String(
      req.query.q || req.query.search || ""
    ).trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query जरूरी है"
      });
    }

    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100
    );

    const filter = {
      isPublished: true,
      $text: {
        $search: query
      }
    };

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find(filter)
        .sort({
          publishedAt: -1
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      News.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      query,
      count: news.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET BREAKING NEWS
// GET /api/news/breaking
// ========================================
exports.getBreakingNews = async (req, res, next) => {
  try {
    const news = await News.find({
      isPublished: true,
      isBreaking: true
    })
      .sort({
        publishedAt: -1
      })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      count: news.length,
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET TRENDING NEWS
// GET /api/news/trending
// ========================================
exports.getTrendingNews = async (req, res, next) => {
  try {
    const news = await News.find({
      isPublished: true,
      isTrending: true
    })
      .sort({
        views: -1,
        publishedAt: -1
      })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      count: news.length,
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// CREATE NEWS
// POST /api/news
// ========================================
exports.createNews = async (req, res, next) => {
  try {
    const {
      title,
      summary,
      content,
      category,
      district,
      location,
      author,
      tags
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content और category जरूरी हैं"
      });
    }

    // Uploaded image
    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const news = await News.create({
      title: String(title).trim(),
      summary: String(summary || "").trim(),
      content: String(content).trim(),
      category: String(category).trim(),
      district: String(district || "").trim(),
      location: String(location || "").trim(),

      author:
        String(author || "").trim() ||
        req.user?.name ||
        "आवाज राजस्थान ब्यूरो",

      authorId: req.user?.id || null,

      tags: parseTags(tags),

      image,

      isBreaking: toBoolean(req.body.isBreaking),
      isTrending: toBoolean(req.body.isTrending),
      isFeatured: toBoolean(req.body.isFeatured),

      isPublished:
        req.body.isPublished === undefined
          ? true
          : toBoolean(req.body.isPublished),

      publishedAt:
        req.body.publishedAt
          ? new Date(req.body.publishedAt)
          : new Date(),

      scheduledAt:
        req.body.scheduledAt
          ? new Date(req.body.scheduledAt)
          : null
    });

    return res.status(201).json({
      success: true,
      message: "News successfully create हुई",
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// UPDATE NEWS
// PUT /api/news/:id
// ========================================
exports.updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News नहीं मिली"
      });
    }

    const {
      title,
      summary,
      content,
      category,
      district,
      location,
      author,
      tags
    } = req.body;

    // केवल भेजे गए fields update होंगे
    if (title !== undefined) {
      news.title = String(title).trim();
    }

    if (summary !== undefined) {
      news.summary = String(summary).trim();
    }

    if (content !== undefined) {
      news.content = String(content).trim();
    }

    if (category !== undefined) {
      news.category = String(category).trim();
    }

    if (district !== undefined) {
      news.district = String(district).trim();
    }

    if (location !== undefined) {
      news.location = String(location).trim();
    }

    if (author !== undefined) {
      news.author = String(author).trim();
    }

    if (tags !== undefined) {
      news.tags = parseTags(tags);
    }

    // New image upload
    if (req.file) {
      news.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.isBreaking !== undefined) {
      news.isBreaking = toBoolean(req.body.isBreaking);
    }

    if (req.body.isTrending !== undefined) {
      news.isTrending = toBoolean(req.body.isTrending);
    }

    if (req.body.isFeatured !== undefined) {
      news.isFeatured = toBoolean(req.body.isFeatured);
    }

    if (req.body.isPublished !== undefined) {
      news.isPublished = toBoolean(req.body.isPublished);
    }

    if (req.body.publishedAt !== undefined) {
      news.publishedAt = req.body.publishedAt
        ? new Date(req.body.publishedAt)
        : null;
    }

    if (req.body.scheduledAt !== undefined) {
      news.scheduledAt = req.body.scheduledAt
        ? new Date(req.body.scheduledAt)
        : null;
    }

    await news.save();

    return res.status(200).json({
      success: true,
      message: "News successfully update हुई",
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// DELETE NEWS
// DELETE /api/news/:id
// ========================================
exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News नहीं मिली"
      });
    }

    await News.deleteOne({
      _id: id
    });

    return res.status(200).json({
      success: true,
      message: "News successfully delete हो गई"
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET NEWS BY CATEGORY
// GET /api/news/category/:category
// ========================================
exports.getNewsByCategory = async (req, res, next) => {
  try {
    const category = String(
      req.params.category || ""
    ).trim();

    const news = await News.find({
      category,
      isPublished: true
    })
      .sort({
        publishedAt: -1
      })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      category,
      count: news.length,
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET NEWS BY DISTRICT
// GET /api/news/district/:district
// ========================================
exports.getNewsByDistrict = async (req, res, next) => {
  try {
    const district = String(
      req.params.district || ""
    ).trim();

    const news = await News.find({
      district: {
        $regex: `^${district}$`,
        $options: "i"
      },
      isPublished: true
    })
      .sort({
        publishedAt: -1
      })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      district,
      count: news.length,
      news
    });

  } catch (error) {
    next(error);
  }
};
// ========================================
// UPDATE NEWS
// PUT /api/news/:id
// ========================================
exports.updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News नहीं मिली"
      });
    }

    const {
      title,
      summary,
      content,
      category,
      district,
      location,
      author,
      tags
    } = req.body;

    // केवल भेजे गए fields update होंगे
    if (title !== undefined) {
      news.title = String(title).trim();
    }

    if (summary !== undefined) {
      news.summary = String(summary).trim();
    }

    if (content !== undefined) {
      news.content = String(content).trim();
    }

    if (category !== undefined) {
      news.category = String(category).trim();
    }

    if (district !== undefined) {
      news.district = String(district).trim();
    }
    if (location !== undefined) {
      news.location = String(location).trim();
    }

    if (author !== undefined) {
      news.author = String(author).trim();
    }

    if (tags !== undefined) {
      news.tags = parseTags(tags);
    }

    // New image upload
    if (req.file) {
      news.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.isBreaking !== undefined) {
      news.isBreaking = toBoolean(req.body.isBreaking);
    }

    if (req.body.isTrending !== undefined) {
      news.isTrending = toBoolean(req.body.isTrending);
    }

    if (req.body.isFeatured !== undefined) {
      news.isFeatured = toBoolean(req.body.isFeatured);
    }

    if (req.body.isPublished !== undefined) {
      news.isPublished = toBoolean(req.body.isPublished);
    }

    if (req.body.publishedAt !== undefined) {
      news.publishedAt = req.body.publishedAt
        ? new Date(req.body.publishedAt)
        : null;
    }

    if (req.body.scheduledAt !== undefined) {
      news.scheduledAt = req.body.scheduledAt
        ? new Date(req.body.scheduledAt)
        : null;
    }

    await news.save();

    return res.status(200).json({
      success: true,
      message: "News successfully update हुई",
      news
    });

  } catch (error) {
    next(error);
  }
};

        // ========================================
// DELETE NEWS
// DELETE /api/news/:id
// ========================================
exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News नहीं मिली"
      });
    }

    await News.deleteOne({
      _id: id
    });

    return res.status(200).json({
      success: true,
      message: "News successfully delete हो गई"
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET NEWS BY CATEGORY
// GET /api/news/category/:category
// ========================================
exports.getNewsByCategory = async (req, res, next) => {
  try {
    const category = String(
      req.params.category || ""
    ).trim();

    const news = await News.find({
      category,
      isPublished: true
    })
      .sort({
        publishedAt: -1
      })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      category,
      count: news.length,
      news
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// GET NEWS BY DISTRICT
// GET /api/news/district/:district
// ========================================
exports.getNewsByDistrict = async (req, res, next) => {
  try {
    const district = String(
      req.params.district || ""
    ).trim();

    const news = await News.find({
      district: {
        $regex: `^${district}$`,
        $options: "i"
      },
      isPublished: true
    })
      .sort({
        publishedAt: -1
      })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      district,
      count: news.length,
      news
    });

  } catch (error) {
    next(error);
  }
};
