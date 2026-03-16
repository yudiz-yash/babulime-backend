const multer = require('multer');
const path = require('path');

// Memory storage for images (converted to base64)
const imageStorage = multer.memoryStorage();

// Memory storage for documents too (Vercel has no persistent filesystem)
const docStorage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) || allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const docFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  }
};

// Image upload → memory (for base64 conversion)
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Document upload → memory (stored as base64 in MongoDB)
const uploadDoc = multer({
  storage: docStorage,
  fileFilter: docFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Helper: convert buffer to base64 data URL
function toBase64(file) {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

module.exports = { uploadImage, uploadDoc, toBase64 };
