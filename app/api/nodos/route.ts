import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'nodos_cognitivos.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    
    const fileData = fs.readFileSync(filePath, 'utf8');
    const nodes = JSON.parse(fileData);
    return NextResponse.json(nodes);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al leer los nodos cognitivos: ' + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newNode = await request.json();
    
    // Validación básica de campos ontológicos obligatorios
    if (!newNode.id_nodo || !newNode.movimiento || !newNode.vector_de_bisociacion) {
      return NextResponse.json({ error: 'Faltan campos ontológicos clave obligatorios.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'app', 'data', 'nodos_cognitivos.json');
    let nodes = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      nodes = JSON.parse(fileData);
    }

    // Evitar ID duplicado
    if (nodes.some((n: any) => n.id_nodo === newNode.id_nodo)) {
      return NextResponse.json({ error: 'Ya existe un nodo cognitivo con este Identificador Único (ID).' }, { status: 400 });
    }

    // Agregar nuevo nodo
    nodes.push(newNode);

    // Guardar en disco
    fs.writeFileSync(filePath, JSON.stringify(nodes, null, 2), 'utf8');

    return NextResponse.json({ success: true, nodes });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al persistir el nodo cognitivo: ' + error.message }, { status: 500 });
  }
}
