const SitemapGenerator = require('sitemap-generator');
const fs = require('fs');
const https = require('https');

const filepath = './public/sitemap.xml'; // Output file path for the sitemap

const generator = SitemapGenerator('https://zkm.tw', {
  maxDepth: 5, // Maximum depth of crawling (optional, adjust as needed)
  maxEntriesPerFile: 50000, // Maximum number of URLs per sitemap file (optional, adjust as needed)
  httpAgent: new https.Agent({ rejectUnauthorized: true }), // Set rejectUnauthorized to true for secure HTTPS connections
});

generator.on('done', () => {
  const sitemapXML = generator.getSitemap(); // Get the generated sitemap XML
  fs.writeFileSync(filepath, sitemapXML.toString(), 'utf8'); // Save the sitemap to the file system after converting to a string
  console.log('Sitemap generated and saved as sitemap.xml');
});

generator.start();
