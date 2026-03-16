const mongoose = require('mongoose');

const careerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  position: { type: String, required: true },
  experience: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  resumeUrl: { type: String, default: null },
  resumeOriginalName: { type: String, default: null },
  isRead: { type: Boolean, default: false },
  status: { type: String, enum: ['new', 'reviewing', 'shortlisted', 'rejected'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
