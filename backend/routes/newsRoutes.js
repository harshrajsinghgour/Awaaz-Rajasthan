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
const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsById,
  searchNews,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.get('/', getNews);
router.get('/search', searchNews);
router.get('/:id', getNewsById);

// Protected Admin/Reporter Routes
router.post('/', protect, authorize('admin', 'reporter'), upload.single('image'), createNews);
router.put('/:id', protect, authorize('admin', 'reporter'), upload.single('image'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

module.exports = router;
