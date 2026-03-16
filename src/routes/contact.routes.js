const express = require('express');
const ContactSubmission = require('../models/ContactSubmission');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/contact — public (submit contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'Name, email and message are required.' });

    await ContactSubmission.create({ name, email, phone, company, subject, message });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact — admin
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const submissions = await ContactSubmission.find()
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await ContactSubmission.countDocuments();
    const unread = await ContactSubmission.countDocuments({ isRead: false });
    res.json({ submissions, total, unread, page: Number(page), pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/contact/:id — admin (mark read/unread)
router.put('/:id', protect, async (req, res) => {
  try {
    const submission = await ContactSubmission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!submission) return res.status(404).json({ error: 'Submission not found.' });
    res.json(submission);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/contact/:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
