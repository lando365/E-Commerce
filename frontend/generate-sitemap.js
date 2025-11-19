const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const fs = require('fs');

// Vos URLs
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/catalogue', changefreq: 'daily', priority: 0.9 },
  { url: '/categories', changefreq: 'weekly', priority: 0.8 },
  { url: '/products', changefreq: 'daily', priority: 0.8 },
  { url: '/privacy-policy', changefreq: 'monthly', priority: 0.3 },
  { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.3 },
];

// Générer le sitemap
const stream = new SitemapStream({ hostname: 'https://votredomaine.com' });

streamToPromise(Readable.from(links).pipe(stream))
  .then((data) => {
    fs.writeFileSync('./src/sitemap.xml', data.toString());
    console.log('✅ Sitemap généré avec succès!');
  })
  .catch((err) => {
    console.error('❌ Erreur:', err);
  });
