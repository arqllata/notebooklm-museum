const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function findAndPatch() {
  try {
    const npxDir = path.join(os.homedir(), '.npm', '_npx');
    if (!fs.existsSync(npxDir)) return;

    const findCmd = `find "${npxDir}" -name "index.js" | grep "decap-server/dist/index.js"`;
    const files = execSync(findCmd, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

    for (const file of files) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('content:r.toString(a)')) {
          content = content.replace('content:r.toString(a)', 'content:r.length>100000?"":r.toString(a)');
          fs.writeFileSync(file, content, 'utf8');
          console.log(`[patch-decap] Patched: ${file}`);
        }
      }
    }
  } catch (err) {
    // Ignore errors silently
  }
}

findAndPatch();
