const express = require('express');
const CareerPosition = require('../models/CareerPosition');
const CareerApplication = require('../models/CareerApplication');
const { uploadDoc } = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// ── Positions ─────────────────────────────────────────────

// GET /api/careers/positions — public
router.get('/positions', async (req, res) => {
  try {
    const positions = await CareerPosition.find({ isActive: true }).sort('order');
    res.json(positions);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/careers/positions/all — admin
router.get('/positions/all', protect, async (req, res) => {
  try {
    const positions = await CareerPosition.find().sort('order');
    res.json(positions);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/careers/positions — protected
router.post('/positions', protect, async (req, res) => {
  try {
    const count = await CareerPosition.countDocuments();
    const position = await CareerPosition.create({ ...req.body, order: count });
    res.status(201).json(position);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/careers/positions/:id — protected
router.put('/positions/:id', protect, async (req, res) => {
  try {
    const position = await CareerPosition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!position) return res.status(404).json({ error: 'Position not found.' });
    res.json(position);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/careers/positions/:id — protected
router.delete('/positions/:id', protect, async (req, res) => {
  try {
    await CareerPosition.findByIdAndDelete(req.params.id);
    res.json({ message: 'Position deleted.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── Applications ──────────────────────────────────────────

// POST /api/careers/applications — public (submit application)
router.post('/applications', uploadDoc.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, experience, coverLetter } = req.body;
    if (!name || !email || !position)
      return res.status(400).json({ error: 'Name, email and position are required.' });

    const app = await CareerApplication.create({
      name, email, phone, position, experience, coverLetter,
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : null,
      resumeOriginalName: req.file ? req.file.originalname : null,
    });
    res.status(201).json({ success: true, id: app._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/careers/applications — admin
router.get('/applications', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const applications = await CareerApplication.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await CareerApplication.countDocuments(filter);
    res.json({ applications, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/careers/applications/:id — admin (update status/read)
router.put('/applications/:id', protect, async (req, res) => {
  try {
    const app = await CareerApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!app) return res.status(404).json({ error: 'Application not found.' });
    res.json(app);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/careers/applications/:id — admin
router.delete('/applications/:id', protect, async (req, res) => {
  try {
    await CareerApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
