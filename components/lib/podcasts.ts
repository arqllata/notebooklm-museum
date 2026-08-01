import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Helper function to read all podcasts from the markdown files
export async function getPodcasts() {
    const directoryPath = path.join(process.cwd(), 'app/data/podcasts');
    try {
        const filenames = await fs.readdir(directoryPath);
        const podcasts = await Promise.all(
            filenames
                .filter((filename) => filename.endsWith('.md'))
                .map(async (filename) => {
                    const filePath = path.join(directoryPath, filename);
                    const fileContents = await fs.readFile(filePath, 'utf8');
                    const { data } = matter(fileContents);
                    
                    // Extraer número inicial del nombre del archivo para ordenarlo
                    const match = filename.match(/^(\d+)/);
                    const orderNumber = match ? parseInt(match[1], 10) : 999999;
                    
                    return {
                        ...data,
                        _orderNumber: orderNumber
                    };
                })
        );
        
        // Ordenar numéricamente de menor a mayor
        podcasts.sort((a: any, b: any) => a._orderNumber - b._orderNumber);
        
        // Quitar la variable temporal antes de retornar
        podcasts.forEach((p: any) => {
            delete p._orderNumber;
        });
        return podcasts as any[];
    } catch (error) {
        console.error("Error reading podcasts directory:", error);
        return [];
    }
}

export async function getPodcast(id: string) {
    const podcasts = await getPodcasts();
    return podcasts.find((p: any) => p.id === id);
}
