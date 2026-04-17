const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../app/data/TIMELINE Movimientos Artísticos del Siglo 20(Recuperado automáticamente).xlsx');

console.log('Leyendo archivo:', filePath);

try {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Leer todo como arreglos puros
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
  
  console.log('\n--- SCAN DE LAS PRIMERAS 10 FILAS CON DATOS ---');
  for (let i = 0; i < Math.min(10, data.length); i++) {
    // Si la fila tiene algo valioso, la imprimimos
    if (data[i] && data[i].length > 0) {
      console.log(`Fila ${i + 1}:`, data[i]);
    }
  }
} catch (error) {
  console.error('Error al leer el archivo:', error.message);
}
