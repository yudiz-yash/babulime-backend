const mongoose = require('mongoose');

const bannerSlideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  alt: { type: String, default: 'Babu Lime slide' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('BannerSlide', bannerSlideSchema);
