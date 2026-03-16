const express = require('express');
const Hero = require('../models/Hero');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/hero — public
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = await Hero.create({});
    res.json(hero);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/hero — protected
router.put('/', protect, async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = new Hero();
    Object.assign(hero, req.body);
    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
