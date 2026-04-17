const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const cmsImagesDir = path.join(__dirname, '..', 'public', 'uploads', 'cms_images');
const podcastsDir = path.join(__dirname, '..', 'app', 'data', 'podcasts');

// Validate directories exist before running
if (!fs.existsSync(uploadsDir) || !fs.existsSync(podcastsDir)) {
  console.log("Directories not found, skipping sanitization...");
  process.exit(0);
}

// Function to sanitize a string: normalizes NFD, removes accents, replaces spaces with hyphens, lowers case.
function sanitize(str) {
  return str
    .normalize('NFD')                     // Decompose accents
    .replace(/[\u0300-\u036f]/g, '')      // Remove decomposed accents
    .replace(/\s+/g, '-')                 // Spaces to hyphens
    .replace(/[^a-zA-Z0-9.\-_]/g, '')     // Remove non-alphanumeric (keep dot, hyphen, underscore)
    .toLowerCase();
}

const renameMap = new Map();

function sanitizeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file === '.' || file === '..') continue;
    
    const oldPath = path.join(dirPath, file);
    if (fs.statSync(oldPath).isDirectory()) continue;

    const newFileName = sanitize(file);
    if (file !== newFileName) {
      const newPath = path.join(dirPath, newFileName);
      fs.renameSync(oldPath, newPath);
      renameMap.set(file, newFileName);
    }
  }
}

sanitizeDirectory(uploadsDir);
sanitizeDirectory(cmsImagesDir);

if (renameMap.size > 0) {
  console.log(`[Sanitizer] Renamed ${renameMap.size} files in public/uploads and cms_images.`);
  
  const mdFiles = fs.readdirSync(podcastsDir).filter(f => f.endsWith('.md'));
  let updatedCount = 0;

  for (const mdFile of mdFiles) {
    const mdPath = path.join(podcastsDir, mdFile);
    let content = fs.readFileSync(mdPath, 'utf8');
    let hasChanges = false;

    for (const [oldName, newName] of renameMap.entries()) {
      if (content.includes(oldName)) {
        content = content.split(oldName).join(newName);
        hasChanges = true;
      }
      
      const encodedOld = encodeURI(oldName);
      if (content.includes(encodedOld)) {
        content = content.split(encodedOld).join(newName);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(mdPath, content, 'utf8');
      updatedCount++;
    }
  }
  
  console.log(`[Sanitizer] Automatically updated ${updatedCount} markdown files with new sanitized paths.`);
}
