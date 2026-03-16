const express = require('express');
const { uploadImage, toBase64 } = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/upload/image — protected
// Converts uploaded image to base64 data URL (stored in DB, not on disk)
router.post('/image', protect, uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  const base64 = toBase64(req.file);
  res.json({ url: base64, originalName: req.file.originalname });
});

module.exports = router;
