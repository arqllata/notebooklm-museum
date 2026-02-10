"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function addPodcast(formData: FormData) {
    try {
        console.log("Server Action: Starting upload process...");
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const imageFile = formData.get('image') as File;
        const audioFile = formData.get('audio') as File;

        console.log(`Server Action: Received form data. Title: ${title}, Audio Size: ${audioFile?.size}, Image Size: ${imageFile?.size}`);

        if (!title || !description || !category || !imageFile || !audioFile) {
            console.log("Server Action: Missing fields.");
            return { success: false, error: "Missing required fields." };
        }

        // save image
        console.log("Server Action: Processing image...");
        const imageBytes = await imageFile.arrayBuffer();
        const imageBuffer = Buffer.from(imageBytes);
        const imageName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
        const imagePath = path.join(process.cwd(), 'public/uploads/images', imageName);
        await fs.writeFile(imagePath, imageBuffer);
        const imageUrl = `/uploads/images/${imageName}`;
        console.log("Server Action: Image saved at " + imagePath);

        // save audio
        console.log("Server Action: Processing audio...");
        const audioBytes = await audioFile.arrayBuffer();
        const audioBuffer = Buffer.from(audioBytes);
        const audioName = `${Date.now()}-${audioFile.name.replace(/\s+/g, '-')}`;
        const audioPath = path.join(process.cwd(), 'public/uploads/audio', audioName);
        await fs.writeFile(audioPath, audioBuffer);
        const audioUrl = `/uploads/audio/${audioName}`;
        console.log("Server Action: Audio saved at " + audioPath);

        // read existing data
        console.log("Server Action: Updating database...");
        const dataPath = path.join(process.cwd(), 'data/podcasts.json');
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const podcasts = JSON.parse(fileContent);

        // add new entry
        const newPodcast = {
            id: Date.now().toString(),
            title,
            description,
            category,
            imageUrl,
            audioUrl,
        };

        podcasts.push(newPodcast);

        // write back
        await fs.writeFile(dataPath, JSON.stringify(podcasts, null, 2));
        console.log("Server Action: Database updated.");

        revalidatePath('/');
        console.log("Server Action: Success.");
        return { success: true };
    } catch (error) {
        console.error("Failed to add podcast:", error);
        return { success: false, error: "Failed to save podcast." };
    }
}
