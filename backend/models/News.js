const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Rajasthan', 'Politics', 'Crime', 'Sports', 'Entertainment', 'Business'] 
  },
  imageUrl: { type: String },
  views: { type: Number, default: 0 },
  isTrending: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);
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
