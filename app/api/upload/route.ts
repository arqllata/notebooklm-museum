import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    console.log("API: Upload request started");
    try {
        const formData = await req.formData();
        console.log("API: FormData parsed");

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const imageFile = formData.get('image') as File;
        const audioFile = formData.get('audio') as File;

        console.log(`API: Received - Title: ${title}, Image: ${imageFile?.name} (${imageFile?.size}), Audio: ${audioFile?.name} (${audioFile?.size})`);

        if (!title || !description || !category || !imageFile || !audioFile) {
            console.error("API: Missing fields");
            return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
        }

        // Helper to sanitize filenames
        const sanitizeFilename = (filename: string) => {
            return filename
                .normalize('NFD') // Decompose combined characters (e.g., é -> e + ´)
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace non-alphanumeric chars with hyphen
                .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
        };

        // Save Image
        console.log("API: Saving image...");
        const imageBytes = await imageFile.arrayBuffer();
        const imageBuffer = Buffer.from(imageBytes);
        const safeImageName = `${Date.now()}-${sanitizeFilename(imageFile.name)}`;
        const imagePath = path.join(process.cwd(), 'public/uploads/images', safeImageName);
        await writeFile(imagePath, imageBuffer);
        const imageUrl = `/uploads/images/${safeImageName}`;
        console.log("API: Image saved at", imagePath);

        // Save Audio
        console.log("API: Saving audio...");
        const audioBytes = await audioFile.arrayBuffer();
        const audioBuffer = Buffer.from(audioBytes);
        const safeAudioName = `${Date.now()}-${sanitizeFilename(audioFile.name)}`;
        const audioPath = path.join(process.cwd(), 'public/uploads/audio', safeAudioName);
        await writeFile(audioPath, audioBuffer);
        const audioUrl = `/uploads/audio/${safeAudioName}`;
        console.log("API: Audio saved at", audioPath);

        // Update JSON
        console.log("API: Updating JSON...");
        const dataPath = path.join(process.cwd(), 'data/podcasts.json');
        const fileContent = await readFile(dataPath, 'utf-8');
        const podcasts = JSON.parse(fileContent);

        const newPodcast = {
            id: Date.now().toString(),
            title,
            description,
            category,
            imageUrl,
            audioUrl,
        };

        podcasts.push(newPodcast);
        await writeFile(dataPath, JSON.stringify(podcasts, null, 2));
        console.log("API: JSON updated");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API: Upload failed:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
