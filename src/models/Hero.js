const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: { type: String, default: "India's Trusted Authority in" },
  titleHighlight: { type: String, default: 'Food-Grade' },
  titleEnd: { type: String, default: 'Natural White Lime Processing' },
  subtitle: { type: String, default: 'Delivering purity, precision and performance since 1987.' },
  tagline: { type: String, default: 'Manufactured in Rajkot. Serving Gujarat. Expanding Pan-India.' },
  buttonText: { type: String, default: 'Discover More' },
  stats: {
    type: [{
      end: { type: Number, required: true },
      suffix: { type: String, default: '+' },
      label: { type: String, required: true },
    }],
    default: [
      { end: 30, suffix: '+', label: 'Years' },
      { end: 80, suffix: 'k+', label: 'Retail Outlets' },
      { end: 45, suffix: '+', label: 'Tons/Day' },
      { end: 60, suffix: '+', label: 'Cities' },
    ],
  },
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
