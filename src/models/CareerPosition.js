const mongoose = require('mongoose');

const careerPositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  description: { type: String, default: '' },
  isNew: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CareerPosition', careerPositionSchema);
