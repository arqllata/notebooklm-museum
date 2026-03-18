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
                    return data;
                })
        );
        // Sort by ID or date if needed, currently returning as is
        return podcasts;
    } catch (error) {
        console.error("Error reading podcasts directory:", error);
        return [];
    }
}

export async function getPodcast(id: string) {
    const podcasts = await getPodcasts();
    return podcasts.find((p: any) => p.id === id);
}
