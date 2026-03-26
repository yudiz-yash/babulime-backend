const express = require('express');
const BannerSlide = require('../models/BannerSlide');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/banner — public
router.get('/', async (req, res) => {
  try {
    const slides = await BannerSlide.find({ isActive: true }).sort('order');
    res.json(slides);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/banner/all — admin
router.get('/all', protect, async (req, res) => {
  try {
    const slides = await BannerSlide.find().sort('order');
    res.json(slides);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/banner — protected
router.post('/', protect, async (req, res) => {
  try {
    const count = await BannerSlide.countDocuments();
    const slide = await BannerSlide.create({ ...req.body, order: count });
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/banner/reorder — protected
router.put('/reorder', protect, async (req, res) => {
  try {
    const { ids } = req.body; // array of _id strings in desired order
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array.' });
    await Promise.all(ids.map((id, index) => BannerSlide.findByIdAndUpdate(id, { order: index })));
    const slides = await BannerSlide.find().sort('order');
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/banner/:id — protected
router.put('/:id', protect, async (req, res) => {
  try {
    const slide = await BannerSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slide) return res.status(404).json({ error: 'Slide not found.' });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/banner/:id — protected
router.delete('/:id', protect, async (req, res) => {
  try {
    await BannerSlide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide deleted.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
