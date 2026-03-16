const express = require('express');
const About = require('../models/About');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/about — public
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) about = await About.create({});
    res.json(about);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/about — protected
router.put('/', protect, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) about = new About();
    Object.assign(about, req.body);
    await about.save();
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
