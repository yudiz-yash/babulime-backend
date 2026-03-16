const express = require('express');
const Feature = require('../models/Feature');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/features — public
router.get('/', async (req, res) => {
  try {
    const features = await Feature.find({ isActive: true }).sort('order');
    res.json(features);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/features/all — admin (all including inactive)
router.get('/all', protect, async (req, res) => {
  try {
    const features = await Feature.find().sort('order');
    res.json(features);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/features — protected
router.post('/', protect, async (req, res) => {
  try {
    const count = await Feature.countDocuments();
    const feature = await Feature.create({ ...req.body, order: count });
    res.status(201).json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/features/:id — protected
router.put('/:id', protect, async (req, res) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feature) return res.status(404).json({ error: 'Feature not found.' });
    res.json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/features/:id — protected
router.delete('/:id', protect, async (req, res) => {
  try {
    await Feature.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feature deleted.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
