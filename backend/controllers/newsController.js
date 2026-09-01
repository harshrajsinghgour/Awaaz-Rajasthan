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
