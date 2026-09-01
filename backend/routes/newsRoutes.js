const express = require('express');
const router = express.Router();
const { getNews, createNews, getNewsById } = require('../controllers/newsController');

router.route('/')
  .get(getNews)
  .post(createNews);

router.route('/:id')
  .get(getNewsById);

module.exports = router;
exports.searchNews = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await News.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
