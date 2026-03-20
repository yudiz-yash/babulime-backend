require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Admin          = require('../models/Admin');
const Hero           = require('../models/Hero');
const About          = require('../models/About');
const Feature        = require('../models/Feature');
const ProductCategory= require('../models/ProductCategory');
const CareerPosition = require('../models/CareerPosition');
const BannerSlide    = require('../models/BannerSlide');
const SiteSettings   = require('../models/SiteSettings');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const ASSETS_DIR = path.join(__dirname, '../../../babulime/assets/images');

// Copy cert images from frontend assets to uploads if they're missing
function ensureCertImages() {
  for (const fname of ['FSSAI-Number.png', 'iso-certificate-final.png']) {
    const dest = path.join(UPLOADS_DIR, fname);
    if (!fs.existsSync(dest)) {
      const src = path.join(ASSETS_DIR, fname);
      if (fs.existsSync(src)) { fs.copyFileSync(src, dest); console.log(`  📋 Copied ${fname} to uploads`); }
    }
  }
}

function imgToBase64(filename) {
  const filepath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filepath)) { console.warn(`  ⚠  Missing: ${filename}`); return null; }
  const ext = path.extname(filename).replace('.', '').toLowerCase();
  const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
  const buffer = fs.readFileSync(filepath);
  return `data:${mimeMap[ext] || 'image/jpeg'};base64,${buffer.toString('base64')}`;
}

async function upsertSetting(key, value) {
  await SiteSettings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
}

async function seed() {
  try {
    ensureCertImages();
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // ── Admin ────────────────────────────────────────────────
    if (!(await Admin.findOne({ email: 'admin@babulime.com' }))) {
      await Admin.create({ name: 'Babu Lime Admin', email: 'admin@babulime.com', password: 'Admin@123' });
      console.log('✅ Admin created');
    } else { console.log('ℹ️  Admin exists'); }

    // ── Hero ─────────────────────────────────────────────────
    await Hero.deleteMany({});
    await Hero.create({
      title: "India's Trusted Authority in", titleHighlight: 'Food-Grade', titleEnd: 'Natural White Lime Processing',
      subtitle: 'Delivering purity, precision and performance since 1987.',
      tagline: 'Manufactured in Rajkot. Serving Gujarat. Expanding Pan-India.',
      buttonText: 'Discover More',
      stats: [{ end: 30, suffix: '+', label: 'Years' }, { end: 80, suffix: 'k+', label: 'Retail Outlets' }, { end: 45, suffix: '+', label: 'Tons/Day' }, { end: 60, suffix: '+', label: 'Cities' }],
    });
    console.log('✅ Hero');

    // ── About ────────────────────────────────────────────────
    await About.deleteMany({});
    await About.create({
      badge: 'ABOUT BABU LIME', heading: 'Three Decades of Trust. One Standard of Purity.',
      paragraphs: [
        'Established over 30 years ago, Babu Lime Pvt Ltd is recognized as a leading processor of food-grade natural white lime in India.',
        'From our fully automated manufacturing facility in Rajkot, Gujarat, we combine traditional expertise with modern industrial systems.',
        'Today, our products are trusted by over <strong>80,000 retail outlets</strong> — reinforcing our position as a category authority in food-grade lime processing.',
      ],
      checkItems: ['Stainless Steel Processing', 'Ultra-Modern Laboratory', 'Hygienic Packaging', 'Batch Traceability'],
      statBadgeValue: '80K+', statBadgeLabel: 'Retail Outlets\nAcross India',
      distributionNetwork: {
        subHeading: 'Our Rich',
        title: 'Distribution Network',
        bullets: ['80,000+ Retail Outlets', '60+ Cities', 'Strong Gujarat Network', 'Growing Pan-India Access'],
        description: 'Dependable availability and consistent retailer support across India.',
      },
    });
    console.log('✅ About');

    // ── Features ─────────────────────────────────────────────
    await Feature.deleteMany({});
    await Feature.insertMany([
      { icon: 'Target', title: 'Precision Processing',       description: 'Advanced ultra-fine grinding technology ensures uniform granulation and smooth texture, delivering consistent product performance.', order: 0 },
      { icon: 'Shield', title: '100% Food-Grade Integrity',  description: 'No artificial coloring. No dilution. No adulteration. Every batch undergoes strict in-house quality testing before dispatch.', order: 1 },
      { icon: 'Zap',    title: 'Advanced Manufacturing',     description: 'Fully automated plant with minimal manual handling, controlled environment and CCTV monitored processes for consistent quality.', order: 2 },
      { icon: 'Leaf',   title: 'Scale & Reliability',        description: '45+ tons daily capacity. Strong Gujarat network. Expanding through national online marketplaces.', order: 3 },
    ]);
    console.log('✅ Features');

    // ── Products ─────────────────────────────────────────────
    console.log('\n📦 Converting product images to base64...');
    await ProductCategory.deleteMany({});
    await ProductCategory.insertMany([
      { slug:'medium',        label:'Medium Parcel',     shortLabel:'Medium',       accent:'#7c3aed', lightBg:'#f3eeff', order:0, products:[
        {name:'Medium Parcel Pouch',     weight:'350 gms',             pack:null,         image:imgToBase64('cat-1-1.jpg'), order:0},
        {name:'Medium Parcel Pouch Bag', weight:null,                  pack:'Pack of 20', image:imgToBase64('cat-1-2.jpg'), order:1},
        {name:'Medium Parcel Loose Bag', weight:'10 Kg',               pack:null,         image:imgToBase64('cat-1-3.jpg'), order:2},
        {name:'Medium Parcel Dabba Bag', weight:'Per Dabba 1.550 Kgs', pack:'Pack of 4',  image:imgToBase64('cat-1-4.jpg'), order:3},
      ]},
      { slug:'ghatta',        label:'Ghatta Parcel',     shortLabel:'Ghatta',       accent:'#6d28d9', lightBg:'#ede9fe', order:1, products:[
        {name:'Ghatta Parcel Pouch',     weight:'350 Gms',             pack:null,         image:imgToBase64('cat-2-1.jpg'), order:0},
        {name:'Ghatta Parcel Pouch Bag', weight:null,                  pack:'Pack of 20', image:imgToBase64('cat-2-2.jpg'), order:1},
        {name:'Ghatta Parcel Loose Bag', weight:'10 Kg',               pack:null,         image:imgToBase64('cat-2-3.jpg'), order:2},
        {name:'Ghatta Parcel Dabba Bag', weight:'Per Dabba 1.600 Kgs', pack:'Pack of 4',  image:imgToBase64('cat-2-4.jpg'), order:3},
      ]},
      { slug:'achha',         label:'Achha Parcel',      shortLabel:'Achha',        accent:'#9333ea', lightBg:'#faf5ff', order:2, products:[
        {name:'Achha Safed Parcel Pouch',     weight:'350 gms', pack:null,         image:imgToBase64('cat-3-1.jpg'), order:0},
        {name:'Achha Safed Parcel Pouch Bag', weight:null,      pack:'Pack of 20', image:imgToBase64('cat-3-2.jpg'), order:1},
      ]},
      { slug:'sardar',        label:'Sardar Parcel',     shortLabel:'Sardar',       accent:'#5b21b6', lightBg:'#f5f3ff', order:3, products:[
        {name:'Sardar Parcel Pouch',     weight:'350 gms', pack:null,         image:imgToBase64('cat-4-1.jpg'), order:0},
        {name:'Sardar Parcel Pouch Bag', weight:null,      pack:'Pack of 20', image:imgToBase64('cat-4-2.jpg'), order:1},
        {name:'Sardar Parcel Loose Bag', weight:'10 Kgs',  pack:null,         image:imgToBase64('cat-4-3.jpg'), order:2},
      ]},
      { slug:'babu-sample',   label:'Babu Sample',       shortLabel:'Babu Sample',  accent:'#7e22ce', lightBg:'#f3e8ff', order:4, products:[
        {name:'Babu Sample Pouch',     weight:'400 gms', pack:null,         image:imgToBase64('cat-5-1.jpg'), order:0},
        {name:'Babu Sample Pouch Bag', weight:null,      pack:'Pack of 30', image:imgToBase64('cat-5-2.jpg'), order:1},
      ]},
      { slug:'sardar-sample', label:'Jay Sardar Sample', shortLabel:'Jay Sardar',   accent:'#4c1d95', lightBg:'#ede9fe', order:5, products:[
        {name:'Jay Sardar Sample Pouch',     weight:'350 gms', pack:null,         image:imgToBase64('cat-6-1.jpg'), order:0},
        {name:'Jay Sardar Sample Pouch Bag', weight:null,      pack:'Pack of 20', image:imgToBase64('cat-6-2.jpg'), order:1},
        {name:'Jay Sardar Sample Loose Bag', weight:'10 Kgs',  pack:null,         image:imgToBase64('cat-6-3.jpg'), order:2},
      ]},
      { slug:'chunna-paste',  label:'Chunna Paste',      shortLabel:'Chunna Paste', accent:'#a21caf', lightBg:'#fdf4ff', order:6, products:[
        {name:'750 gms Chunna Paste (Pouch)', weight:'750 gms', pack:'15 Pouch / bag',                image:imgToBase64('cat-7-1.jpg'), order:0},
        {name:'1 Kg Chunna Paste (Pouch)',    weight:'1 Kg',    pack:'10 Pouch / bag · 20 Pcs / bag', image:imgToBase64('cat-7-2.jpg'), order:1},
        {name:'5 Kg Chunna Paste (Pouch)',    weight:'5 Kg',    pack:'4 Pouch / bag',                 image:imgToBase64('cat-7-3.jpg'), order:2},
        {name:'150 gms Chunna Paste (Dabbi)', weight:'150 gms', pack:'10 Pcs / box',                  image:imgToBase64('cat-7-4.jpg'), order:3},
        {name:'1 Kg Chunna Paste (Dabba)',    weight:'1 Kg',    pack:'18 Pcs / box',                  image:imgToBase64('cat-7-5.jpg'), order:4},
        {name:'18 Kgs Chunna Paste (Bucket)', weight:'18 Kgs',  pack:null,                            image:imgToBase64('cat-7-6.jpg'), order:5},
        {name:'20 Kgs Chunna Paste (Kerbo)',  weight:'20 Kgs',  pack:null,                            image:imgToBase64('cat-7-7.jpg'), order:6},
      ]},
    ]);
    console.log('✅ Products (with base64 images)');

    // ── Careers ──────────────────────────────────────────────
    await CareerPosition.deleteMany({});
    await CareerPosition.insertMany([
      { title:'Production Supervisor',            department:'Manufacturing',        location:'Rajkot, Gujarat',      type:'Full-time', isNew:true,  order:0 },
      { title:'Quality Analyst',                  department:'Quality Assurance',    location:'Rajkot, Gujarat',      type:'Full-time', isNew:true,  order:1 },
      { title:'Sales Executive — Gujarat Region', department:'Sales & Distribution', location:'Gujarat (Multi-City)', type:'Full-time', isNew:false, order:2 },
      { title:'Packaging Machine Operator',       department:'Manufacturing',        location:'Rajkot, Gujarat',      type:'Full-time', isNew:false, order:3 },
    ]);
    console.log('✅ Career positions');

    // ── Banner Slides ────────────────────────────────────────
    console.log('\n🖼  Converting banner slides to base64...');
    await BannerSlide.deleteMany({});
    const slides = [];
    for (let i = 1; i <= 13; i++) {
      const b64 = imgToBase64(`slide-${i}.webp`);
      if (b64) slides.push({ imageUrl: b64, alt: `Babu Lime slide ${i}`, order: i - 1, isActive: true });
    }
    await BannerSlide.insertMany(slides);
    console.log(`✅ Banner slides (${slides.length})`);

    // ── Site Settings ────────────────────────────────────────
    console.log('\n⚙️  Seeding site settings...');

    // Tradition Timeline
    await upsertSetting('tradition_timeline', {
      badge: 'Our Legacy',
      heading: 'Rooted In Indian Heritage',
      description: "The art of paan preparation is deeply woven into India's cultural fabric — from roadside stalls to grand celebrations, it represents hospitality, craftsmanship and community.",
      milestones: [
        { label: '1987', title: 'Founded',       desc: "Babu Lime was founded in Rajkot with a singular mission — to honour India's paan tradition by delivering the purest food-grade lime.", style: 'light' },
        { label: 'Rajkot', title: 'Gujarat, India', desc: 'What began at a single shop in Rajkot grew into a fully automated manufacturing facility combining traditional expertise with modern industrial systems.', style: 'light' },
        { label: 'Today', title: 'Pan-India Reach', desc: 'Serving over 80,000 retail outlets across India, with an expanding presence through national online marketplaces.', style: 'dark' },
      ],
    });

    // Manufacturing
    await upsertSetting('manufacturing', {
      badge: 'MANUFACTURING EXCELLENCE',
      heading: 'Manufacturing Excellence',
      description: 'Engineered for consistency and hygiene at every stage. All machinery fabricated using stainless steel for food safety compliance.',
      subDescription: 'All machinery fabricated using stainless steel for food safety compliance.',
      vision: {
        heading: 'Our Vision',
        desc1: 'To remain the most trusted name in food-grade lime processing by continuously enhancing manufacturing standards, operational systems and market reach.',
        desc2: 'Committed to sustainable growth, process excellence and long-term distributor relationships.',
      },
      steps: [
        { icon: 'Layers',      title: 'Raw Material Selection',   desc: 'Careful selection of materials to ensure baseline quality before processing begins.' },
        { icon: 'Droplets',    title: 'Cleaning & Pre-Processing', desc: 'Thorough removal of impurities and contaminants before main processing.' },
        { icon: 'Settings',    title: 'Ultra-Fine Grinding',       desc: 'Advanced ultra-fine grinding technology ensures uniform granulation and smooth texture throughout.' },
        { icon: 'Activity',    title: 'Laboratory Testing',        desc: 'In-house testing of every batch for full quality assurance before dispatch.' },
        { icon: 'Thermometer', title: 'Hygienic Packing',          desc: 'Maintaining purity through careful, contamination-free handling and packing.' },
        { icon: 'Cpu',         title: 'Sealed Dispatch',           desc: 'Secure, tamper-proof dispatch ensuring product integrity from plant to shelf.' },
      ],
      quality: {
        heading: 'Quality & Compliance',
        description: 'Quality is non-negotiable. Continuous internal audits ensure standardization across all batches. Every product is laboratory tested before market release.',
        items: ['FSSAI Standards', 'Good Manufacturing Practices (GMP)', 'Internal Quality Assurance Protocols'],
        infrastructureHeading: 'Infrastructure Highlights',
        infrastructureText: 'All processing machinery is fabricated using stainless steel for food safety compliance and durability. Our plant operates under controlled industrial protocols designed for consistency, hygiene and operational efficiency.',
      },
    });

    // Compliance
    await upsertSetting('compliance', {
      heading: 'Quality & Compliance',
      description: 'Quality is non-negotiable. Every batch is laboratory tested before market release.',
      items: [
        { icon: 'Award',       title: 'FSSAI Standards',              desc: 'Fully compliant with Food Safety and Standards Authority of India regulations.' },
        { icon: 'ShieldCheck', title: 'Good Manufacturing Practices', desc: 'GMP protocols rigorously followed across all stages of production.' },
        { icon: 'CheckSquare', title: 'Internal Quality Assurance',   desc: 'Every batch is laboratory tested before market release.' },
        { icon: 'FileText',    title: 'ISO Certified Excellence',     desc: 'Certified under FSSAI and ISO 9001:2015 — meeting all national and international food safety requirements with zero compromise on quality.' },
      ],
    });

    // Certification
    await upsertSetting('certification', {
      badge: 'CERTIFICATION',
      heading: 'ISO Certified Excellence',
      description: 'When it comes to Quality there is no compromise, following all standards and good manufacturing practices.',
      items: [
        { label: 'FSSAI Certified',      alt: 'FSSAI Certification',       image: imgToBase64('FSSAI-Number.png') },
        { label: 'ISO 9001:2015 Certified', alt: 'ISO 9001:2015 Certificate', image: imgToBase64('iso-certificate-final.png') },
      ],
    });

    // Distribution
    await upsertSetting('distribution', {
      badge: 'DISTRIBUTION NETWORK',
      heading: 'Strong Gujarat Presence. Expanding Pan-India.',
      description: 'Ensuring dependable availability and consistent retailer support across India. We have built one of the strongest distribution networks in the lime category.',
      stats: [
        { value: '80,000+', label: 'Retail Outlets' },
        { value: '60+',     label: 'Cities' },
        { value: 'Growing', label: 'Pan-India Access — Dependable availability and consistent retailer support across India.' },
      ],
      mapLat: '22.319917062800005',
      mapLng: '70.84248014418061',
    });

    // Branding
    await upsertSetting('branding', {
      badge: 'Brand Showcase',
      heading: 'Media & Branding',
      description: 'From newspaper features to national cricket sponsorships — our brand story at a glance.',
      items: [
        { icon: 'Newspaper', title: 'Press',       desc: 'Featured in Gujarat Samachar — recognized for 30 years of excellence in food-grade processing.' },
        { icon: 'Trophy',    title: 'Sports',      desc: 'Official branding partner at national-level cricket events across Gujarat.' },
        { icon: 'Store',     title: 'Retail',      desc: '80,000+ branded retail points with consistent signage, displays and packaging.' },
        { icon: 'Award',     title: 'Awards',      desc: 'Honored for quality standards, manufacturing excellence and business growth.' },
        { icon: 'Megaphone', title: 'Print Media', desc: 'Regional and national print advertising reinforcing category leadership.' },
        { icon: 'Users',     title: 'Events',      desc: 'Active presence at food industry trade shows, community fairs and cultural events.' },
      ],
    });

    // CTA
    await upsertSetting('cta', {
      heading: 'Distributor & Business Inquiries Welcome',
      description: 'We welcome partnerships from distributors, retailers and institutional buyers across India. Committed to sustainable growth, process excellence and long-term distributor relationships.',
      primaryBtnText: 'Write to Us',
      phone: '+91-9227706516',
    });

    // Footer / Contact Info
    await upsertSetting('footer', {
      description: "India's leading processor of food-grade natural white lime. Manufactured in Rajkot. Serving Gujarat. Expanding Pan-India. Since 1987.",
      address: 'Opp. Saurashtra Paper Mill,\nNavagam-Anandpar Road,\nRajkot – 360003, Gujarat, India',
      email: 'babulimepvtltd87@gmail.com',
      phones: ['+91-9227706516', '0281-2701665'],
      instagramUrl: 'https://instagram.com/babulimeindia?igshid=MzRlODBiNWFlZA==',
      facebookUrl: 'https://www.facebook.com/BABULIMEINDIA',
    });

    console.log('✅ All site settings seeded');
    console.log('\n🎉 Seed complete! Admin: admin@babulime.com / Admin@123');

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
