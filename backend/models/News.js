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
