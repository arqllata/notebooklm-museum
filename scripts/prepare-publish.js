const fs = require('fs');
const path = require('path');

const repoDir = path.join(__dirname, '..');
const uploadsDir = path.join(repoDir, 'public', 'uploads');
const cmsImagesDir = path.join(repoDir, 'public', 'uploads', 'cms_images');
const podcastsDir = path.join(repoDir, 'app', 'data', 'podcasts');

const mediaAudioDir = path.join(repoDir, 'media', 'audio');
const mediaDocsDir = path.join(repoDir, 'media', 'documents');

// Ensure destination directories exist
fs.mkdirSync(mediaAudioDir, { recursive: true });
fs.mkdirSync(mediaDocsDir, { recursive: true });

// Helper to move file if it exists
function moveFile(src, dest) {
  if (fs.existsSync(src)) {
    // If destination already exists, delete it first to avoid EEXIST
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    fs.renameSync(src, dest);
    console.log(`Moved: ${path.basename(src)} -> ${path.relative(repoDir, dest)}`);
    return true;
  }
  return false;
}

// 1. Scan and move heavy files from public/uploads/ and public/uploads/cms_images/
function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) continue;

    if (ext === '.mp3') {
      moveFile(filePath, path.join(mediaAudioDir, file));
    } else if (ext === '.pdf' || ext === '.docx') {
      moveFile(filePath, path.join(mediaDocsDir, file));
    }
  }
}

console.log("Starting heavy files migration...");
processDirectory(uploadsDir);
processDirectory(cmsImagesDir);

// 2. Scan the media folders to get lists of all moved files (past & present)
const audioFiles = fs.readdirSync(mediaAudioDir).filter(f => !fs.statSync(path.join(mediaAudioDir, f)).isDirectory());
const docFiles = fs.readdirSync(mediaDocsDir).filter(f => !fs.statSync(path.join(mediaDocsDir, f)).isDirectory());

// Helper to generate ISO string with local timezone offset
function getLocalISOString() {
  const now = new Date();
  const offsetMin = now.getTimezoneOffset();
  const sign = offsetMin <= 0 ? '+' : '-';
  const absMin = Math.abs(offsetMin);
  const hours = String(Math.floor(absMin / 60)).padStart(2, '0');
  const minutes = String(absMin % 60).padStart(2, '0');
  const tzOffset = `${sign}${hours}:${minutes}`;

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const sec = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${min}:${sec}.000${tzOffset}`;
}

// Find markdown files that have uncommitted git changes or were recently touched
function getModifiedMarkdownFiles() {
  const { execSync } = require('child_process');
  const files = new Set();
  try {
    const statusOut = execSync('git status --porcelain "app/data/podcasts/*.md"', { encoding: 'utf8' });
    const lines = statusOut.split('\n').filter(Boolean);
    for (const line of lines) {
      const match = line.slice(3).trim();
      if (match.endsWith('.md')) {
        files.add(path.basename(match));
      }
    }
  } catch (e) {
    // Ignore git status errors
  }
  return files;
}

// 3. Scan and rewrite markdown files
if (fs.existsSync(podcastsDir)) {
  const mdFiles = fs.readdirSync(podcastsDir).filter(f => f.endsWith('.md'));
  const modifiedInGit = getModifiedMarkdownFiles();
  let updatedCount = 0;

  for (const mdFile of mdFiles) {
    const mdPath = path.join(podcastsDir, mdFile);
    let content = fs.readFileSync(mdPath, 'utf8');
    let hasChanges = false;
    const isModified = modifiedInGit.has(mdFile);

    // Rewrite cdn.jsdelivr.net references back to raw.githubusercontent.com due to jsDelivr's 20MB limit
    const rawHost = 'https://raw.githubusercontent.com/arqllata/notebooklm-museum/main/media/';
    const cdnHost = 'https://cdn.jsdelivr.net/gh/arqllata/notebooklm-museum@main/media/';
    if (content.includes(cdnHost)) {
      content = content.split(cdnHost).join(rawHost);
      hasChanges = true;
    }

    // Replace audio references
    for (const file of audioFiles) {
      const gitHubUrl = `https://raw.githubusercontent.com/arqllata/notebooklm-museum/main/media/audio/${file}`;
      
      const localCmsPath = `/uploads/cms_images/${file}`;
      if (content.includes(localCmsPath)) {
        content = content.split(localCmsPath).join(gitHubUrl);
        hasChanges = true;
      }
      
      const localParentPath = `/uploads/${file}`;
      if (content.includes(localParentPath)) {
        content = content.split(localParentPath).join(gitHubUrl);
        hasChanges = true;
      }
    }

    // Replace document/pdf references
    for (const file of docFiles) {
      const gitHubUrl = `https://raw.githubusercontent.com/arqllata/notebooklm-museum/main/media/documents/${file}`;
      
      const localCmsPath = `/uploads/cms_images/${file}`;
      if (content.includes(localCmsPath)) {
        content = content.split(localCmsPath).join(gitHubUrl);
        hasChanges = true;
      }
      
      const localParentPath = `/uploads/${file}`;
      if (content.includes(localParentPath)) {
        content = content.split(localParentPath).join(gitHubUrl);
        hasChanges = true;
      }
    }

    // Auto-update date and clock if the file was modified in Git or has newly linked assets
    if (isModified || hasChanges) {
      const currentTimestamp = getLocalISOString();
      if (/^date:\s*.+$/m.test(content)) {
        content = content.replace(/^date:\s*.+$/m, `date: ${currentTimestamp}`);
      } else {
        // Insert after initial '---'
        content = content.replace(/^---\s*\n/, `---\ndate: ${currentTimestamp}\n`);
      }
      hasChanges = true;
      console.log(`Auto-updated clock & date for: ${mdFile} -> ${currentTimestamp}`);
    }

    if (hasChanges) {
      fs.writeFileSync(mdPath, content, 'utf8');
      updatedCount++;
      console.log(`Updated: ${mdFile}`);
    }
  }
  console.log(`Link rewriting complete! Updated ${updatedCount} markdown files.`);
}
