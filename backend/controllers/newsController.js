const News = require('../models/News');

// Fetch all news with filtering & pagination
exports.getNews = async (req, res) => {
  try {
    const { category, trending, limit = 10, page = 1 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (trending) query.isTrending = trending === 'true';

    const newsList = await News.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json({ success: true, count: newsList.length, data: newsList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new article (Admin/Reporter)
exports.createNews = async (req, res) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Increment view count on single article fetch
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id, 
      { $inc: { views: 1 } }, 
      { new: true }
    );
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// News Edit karna
exports.updateNews = async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// News Delete karna
exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// News Edit karna
exports.updateNews = async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// News Delete karna
exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const News = require('../models/News');

// 1. Fetch News (Filters + Pagination)
exports.getNews = async (req, res) => {
  try {
    const { category, trending, limit = 10, page = 1 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (trending) query.isTrending = trending === 'true';

    const newsList = await News.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      count: newsList.length,
      total,
      page: Number(page),
      data: newsList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Fetch Single News & Auto-Increment View Count
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id, 
      { $inc: { views: 1 } }, 
      { new: true }
    );
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Search News
exports.searchNews = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

    const results = await News.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Create News (Admin/Reporter)
exports.createNews = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    const newsData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      isTrending: req.body.isTrending || false,
      imageUrl: imageUrl
    };

    const news = await News.create(newsData);
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Update News
exports.updateNews = async (req, res) => {
  try {
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }

    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete News
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.status(200).json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
          
