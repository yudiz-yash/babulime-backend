const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: String, default: null },
  pack: { type: String, default: null },
  image: { type: String, default: null },
  order: { type: Number, default: 0 },
});

const productCategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  shortLabel: { type: String, required: true },
  accent: { type: String, default: '#7c3aed' },
  lightBg: { type: String, default: '#f3eeff' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  products: { type: [productItemSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
