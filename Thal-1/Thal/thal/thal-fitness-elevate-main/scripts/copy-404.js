const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');
const fallbackFile = path.join(distDir, '404.html');

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Have you run `npm run build`?');
  process.exit(1);
}

if (!fs.existsSync(indexFile)) {
  console.error('index.html not found in dist. Did the build succeed?');
  process.exit(1);
}

try {
  fs.copyFileSync(indexFile, fallbackFile);
  console.log('Copied index.html -> 404.html (SPA fallback)');
} catch (err) {
  console.error('Failed to copy index.html to 404.html:', err);
  process.exit(1);
}

// Also create a Netlify _redirects file so that Netlify serves index.html for all routes
const redirectsFile = path.join(distDir, '_redirects');
const redirectsContent = '/*    /index.html   200';
try {
  fs.writeFileSync(redirectsFile, redirectsContent, 'utf8');
  console.log('Created dist/_redirects for Netlify');
} catch (err) {
  console.error('Failed to create _redirects:', err);
}
