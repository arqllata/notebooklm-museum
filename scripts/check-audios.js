const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const podcastsDir = path.join(__dirname, '..', 'app', 'data', 'podcasts');
const publicDir = path.join(__dirname, '..', 'public');

const files = fs.readdirSync(podcastsDir).filter(f => f.endsWith('.md'));
let missing = [];
let noAudio = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(podcastsDir, file), 'utf8');
  const { data } = matter(content);
  
  if (!data.audioUrl) {
    noAudio.push(file);
    continue;
  }
  
  const audioRelPath = data.audioUrl.startsWith('/') ? data.audioUrl.substring(1) : data.audioUrl;
  const absoluteAudioPath = path.join(publicDir, audioRelPath);
  const decodedPath = decodeURI(absoluteAudioPath);
  
  if (!fs.existsSync(absoluteAudioPath) && !fs.existsSync(decodedPath)) {
    missing.push({ file, audioUrl: data.audioUrl });
  }
}

console.log("=== Reporte de Audios Faltantes ===");
if (noAudio.length > 0) {
  console.log("\nEpisodios sin 'audioUrl' definido:");
  noAudio.forEach(f => console.log(`- ${f}`));
} else {
  console.log("\nTodos los episodios tienen un campo 'audioUrl'.");
}

if (missing.length > 0) {
  console.log("\nEpisodios con audioUrl configurado, pero el ARCHIVO físico no existe:");
  missing.forEach(m => console.log(`- ${m.file} -> ${m.audioUrl}`));
} else {
  console.log("\n¡EXCELENTE! Todos los archivos de audio listados existen en el disco.");
}
