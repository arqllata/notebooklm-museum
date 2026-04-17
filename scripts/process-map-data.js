const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

// 1. DICCIONARIO DE COORDENADAS (Longitud, Latitud)
// Convertirá nombres de regiones históricas a coordenadas en el mapamundi.
const GEO_DICTIONARY = {
  'mesoamérica, andes': [-95.2, 19.4], // Centroamérica/México aprox
  'global': [0, 0], // Si es global, lo centraremos o haremos un trato especial en UI
  'australia': [133.7, -25.2],
  'norte de áfrica': [9.0, 30.0],
  'ártico': [-70.0, 75.0],
  'europa central y atlántica': [10.0, 50.0],
  'europa occidental': [2.2, 46.2], // Francia aprox
  'rusia': [37.6, 55.7], // Moscú aprox
  'alemania': [10.4, 51.1],
  'francia': [2.3, 48.8], // París
  'italia': [12.4, 41.9], // Roma
  'estados unidos': [-95.7, 37.0],
  'nueva york': [-74.0, 40.7],
  'reino unido': [-0.1, 51.5], // Londres
  'españa': [-3.7, 40.4], // Madrid
  'japon': [139.6, 35.6],
  'parís': [2.3, 48.8], // París
  'méxico': [-99.1, 19.4],
  'berlín': [13.4, 52.5],
  'viena': [16.3, 48.2],
  'londres': [-0.1, 51.5]
};

function getCoordinates(locationStr) {
  if (!locationStr) return [0, 0];
  const locRaw = locationStr.toLowerCase();
  
  // Buscar a ver si una palabra coincide o está contenida
  for (const [key, coords] of Object.entries(GEO_DICTIONARY)) {
    if (locRaw.includes(key)) {
      return coords;
    }
  }
  // Coordenada por defecto (océano atlántico o tratar como global)
  return [0, 20]; 
}

const inputPath = path.join(__dirname, '../app/data/TIMELINE Movimientos Artísticos del Siglo 20(Recuperado automáticamente).xlsx');
const outputPath = path.join(__dirname, '../app/data/mapData.json');

console.log('Leyendo base de datos original...');

try {
  const fileBuffer = fs.readFileSync(inputPath);
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });

  const finalData = [];

  // Recorrer filas buscando datos (se brinca las primeras decorativas)
  rawData.forEach((row, index) => {
    // Según nuestro scan, 'Movimiento' está en el index 6 y el 'Inicio' en el 7
    const id = row[5];
    const name = row[6];
    const start = row[7];
    
    // Validar que sea una fila de datos reales (tiene ID numérico y nombre de movimiento)
    if (name && typeof name === 'string' && typeof start === 'number') {
      
      const rawLocation = row[9] ? String(row[9]) : '';
      const coords = getCoordinates(rawLocation);

      finalData.push({
        id: id || Date.now() + Math.random(),
        movement: name.trim(),
        startYear: start,
        endYear: typeof row[8] === 'number' ? row[8] : 2026,
        locationName: rawLocation,
        longitude: coords[0],
        latitude: coords[1],
        keyFigures: row[10] ? String(row[10]) : '',
        keyArtworks: row[11] ? String(row[11]) : '',
        description: row[14] ? String(row[14]) : '',
      });
    }
  });

  // Guardar a JSON
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  console.log('✅ ¡Éxito! Base de datos procesada y guardada en app/data/mapData.json');
  console.log(`Se exportaron ${finalData.length} movimientos artísticos listos para mapearse.`);

} catch (error) {
  console.error('❌ Error general procesando archivo:', error.message);
}
