const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Memory storage for images (will be converted to base64)
const imageStorage = multer.memoryStorage();

// Disk storage for documents (resumes etc.)
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

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

// Document upload → disk (resumes, etc.)
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
