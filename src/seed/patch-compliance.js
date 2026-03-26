require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const SiteSettings = require('../models/SiteSettings');

async function patch() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  await SiteSettings.findOneAndUpdate(
    { key: 'compliance' },
    {
      value: {
        heading: 'Quality & Compliance',
        description: 'Quality is non-negotiable. Every batch is laboratory tested before market release.',
        items: [
          { icon: 'Award',       title: 'FSSAI Standards',              desc: 'Fully compliant with Food Safety and Standards Authority of India regulations. FSSAI Lic. No.: 1001702100269' },
          { icon: 'ShieldCheck', title: 'Good Manufacturing Practices', desc: 'GMP protocols rigorously followed across all stages of production.' },
          { icon: 'CheckSquare', title: 'Internal Quality Assurance',   desc: 'Every batch is laboratory tested before market release.' },
          { icon: 'FileText',    title: 'ISO Certified Excellence',     desc: 'Certified under FSSAI and ISO 9001:2015 — meeting all national and international food safety requirements with zero compromise on quality.' },
        ],
      },
    },
    { upsert: true, new: true }
  );

  console.log('✅ Compliance setting patched with FSSAI Lic. No.: 1001702100269');
  await mongoose.disconnect();
  process.exit(0);
}

patch().catch(err => { console.error(err); process.exit(1); });
