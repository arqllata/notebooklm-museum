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

// 3. Scan and rewrite markdown files
if (fs.existsSync(podcastsDir)) {
  const mdFiles = fs.readdirSync(podcastsDir).filter(f => f.endsWith('.md'));
  let updatedCount = 0;

  for (const mdFile of mdFiles) {
    const mdPath = path.join(podcastsDir, mdFile);
    let content = fs.readFileSync(mdPath, 'utf8');
    let hasChanges = false;

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

    if (hasChanges) {
      fs.writeFileSync(mdPath, content, 'utf8');
      updatedCount++;
      console.log(`Updated markdown links in: ${mdFile}`);
    }
  }
  console.log(`Link rewriting complete! Updated ${updatedCount} markdown files.`);
}
