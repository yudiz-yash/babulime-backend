const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    res.json(admin);
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!(await admin.comparePassword(currentPassword)))
      return res.status(400).json({ error: 'Current password is incorrect.' });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password changed successfully.' });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
