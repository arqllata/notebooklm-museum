import { NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';

// Helper to get podcasts data
async function getPodcasts() {
    const dataPath = path.join(process.cwd(), 'data/podcasts.json');
    const fileContent = await readFile(dataPath, 'utf-8');
    return JSON.parse(fileContent);
}

// Helper to save podcasts data
async function savePodcasts(podcasts: any[]) {
    const dataPath = path.join(process.cwd(), 'data/podcasts.json');
    await writeFile(dataPath, JSON.stringify(podcasts, null, 2));
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const podcasts = await getPodcasts();
        const podcast = podcasts.find((p: any) => p.id === id);

        if (!podcast) {
            return NextResponse.json({ success: false, error: "Podcast not found" }, { status: 404 });
        }

        return NextResponse.json(podcast);
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const imageFile = formData.get('image') as File | null;
        const audioFile = formData.get('audio') as File | null;

        const podcasts = await getPodcasts();
        const index = podcasts.findIndex((p: any) => p.id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: "Podcast not found" }, { status: 404 });
        }

        let imageUrl = podcasts[index].imageUrl;
        let audioUrl = podcasts[index].audioUrl;

        // Helper to sanitize filenames
        const sanitizeFilename = (filename: string) => {
            return filename
                .normalize('NFD') // Decompose combined characters
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace non-alphanumeric chars with hyphen
                .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
        };

        // Handle Image Replacement
        if (imageFile && imageFile.size > 0) {
            console.log("API: Replacing image...");
            // Delete old image if local
            if (imageUrl && imageUrl.startsWith('/uploads/')) {
                try {
                    await unlink(path.join(process.cwd(), 'public', imageUrl));
                } catch (e) {
                    console.warn("Failed to delete old image:", e);
                }
            }
            // Save new image
            const imageBytes = await imageFile.arrayBuffer();
            const imageBuffer = Buffer.from(imageBytes);
            const safeImageName = `${Date.now()}-${sanitizeFilename(imageFile.name)}`;
            const imagePath = path.join(process.cwd(), 'public/uploads/images', safeImageName);
            await writeFile(imagePath, imageBuffer);
            imageUrl = `/uploads/images/${safeImageName}`;
        }

        // Handle Audio Replacement
        if (audioFile && audioFile.size > 0) {
            console.log("API: Replacing audio...");
            // Delete old audio if local
            if (audioUrl && audioUrl.startsWith('/uploads/')) {
                try {
                    await unlink(path.join(process.cwd(), 'public', audioUrl));
                } catch (e) {
                    console.warn("Failed to delete old audio:", e);
                }
            }
            // Save new audio
            const audioBytes = await audioFile.arrayBuffer();
            const audioBuffer = Buffer.from(audioBytes);
            const safeAudioName = `${Date.now()}-${sanitizeFilename(audioFile.name)}`;
            const audioPath = path.join(process.cwd(), 'public/uploads/audio', safeAudioName);
            await writeFile(audioPath, audioBuffer);
            audioUrl = `/uploads/audio/${safeAudioName}`;
        }

        // Update fields
        podcasts[index] = {
            ...podcasts[index],
            title: title || podcasts[index].title,
            description: description || podcasts[index].description,
            category: category || podcasts[index].category,
            imageUrl,
            audioUrl
        };

        await savePodcasts(podcasts);

        return NextResponse.json({ success: true, podcast: podcasts[index] });
    } catch (error) {
        console.error("Update failed:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const podcasts = await getPodcasts();
        const podcast = podcasts.find((p: any) => p.id === id);

        if (!podcast) {
            return NextResponse.json({ success: false, error: "Podcast not found" }, { status: 404 });
        }

        // Delete associated files if they exist and are local uploads
        // We only attempt to delete if they start with /uploads/
        if (podcast.imageUrl && podcast.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(process.cwd(), 'public', podcast.imageUrl);
            try {
                await unlink(imagePath);
            } catch (e) {
                console.warn("Failed to delete image file:", e);
            }
        }

        if (podcast.audioUrl && podcast.audioUrl.startsWith('/uploads/')) {
            const audioPath = path.join(process.cwd(), 'public', podcast.audioUrl);
            try {
                await unlink(audioPath);
            } catch (e) {
                console.warn("Failed to delete audio file:", e);
            }
        }

        // Remove from array
        const newPodcasts = podcasts.filter((p: any) => p.id !== id);
        await savePodcasts(newPodcasts);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete failed:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
