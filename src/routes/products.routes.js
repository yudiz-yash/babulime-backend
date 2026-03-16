const express = require('express');
const ProductCategory = require('../models/ProductCategory');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/products — public
router.get('/', async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true }).sort('order');
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/products/all — admin
router.get('/all', protect, async (req, res) => {
  try {
    const categories = await ProductCategory.find().sort('order');
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/products — protected
router.post('/', protect, async (req, res) => {
  try {
    const count = await ProductCategory.countDocuments();
    const category = await ProductCategory.create({ ...req.body, order: count });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id — protected
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id — protected
router.delete('/:id', protect, async (req, res) => {
  try {
    await ProductCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/products/:id/items — add product to category
router.post('/:id/items', protect, async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    category.products.push(req.body);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id/items/:itemId — update product in category
router.put('/:id/items/:itemId', protect, async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    const item = category.products.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Product not found.' });
    Object.assign(item, req.body);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id/items/:itemId — delete product from category
router.delete('/:id/items/:itemId', protect, async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    category.products.pull(req.params.itemId);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
