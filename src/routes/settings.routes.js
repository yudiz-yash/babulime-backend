const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/settings/:key — public
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSettings.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ error: 'Setting not found.' });
    res.json(setting.value);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/settings/:key — protected
router.put('/:key', protect, async (req, res) => {
  try {
    const setting = await SiteSettings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body },
      { new: true, upsert: true }
    );
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
