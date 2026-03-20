const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  badge: { type: String, default: 'ABOUT BABU LIME' },
  heading: { type: String, default: 'Three Decades of Trust. One Standard of Purity.' },
  paragraphs: {
    type: [String],
    default: [
      'Established over 30 years ago, Babu Lime Pvt Ltd is recognized as a leading processor of food-grade natural white lime in India.',
      'From our fully automated manufacturing facility in Rajkot, Gujarat, we combine traditional expertise with modern industrial systems.',
      'Today, our products are trusted by over <strong>80,000 retail outlets</strong> — reinforcing our position as a category authority in food-grade lime processing.',
    ],
  },
  checkItems: {
    type: [String],
    default: [
      'Stainless Steel Processing',
      'Ultra-Modern Laboratory',
      'Hygienic Packaging',
      'Batch Traceability',
    ],
  },
  statBadgeValue: { type: String, default: '80K+' },
  statBadgeLabel: { type: String, default: 'Retail Outlets\nAcross India' },
  distributionNetwork: {
    subHeading: { type: String, default: 'Our Rich' },
    title: { type: String, default: 'Distribution Network' },
    bullets: { type: [String], default: ['80,000+ Retail Outlets', '60+ Cities', 'Strong Gujarat Network', 'Growing Pan-India Access'] },
    description: { type: String, default: 'Dependable availability and consistent retailer support across India.' },
  },
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
