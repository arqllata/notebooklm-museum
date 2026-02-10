export const dynamic = 'force-dynamic';

import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import MuseumLayout from '@/components/Layout/MuseumLayout';
import GalleryContent from '@/components/Home/GalleryContent';

async function getPodcasts() {
  const filePath = path.join(process.cwd(), 'data/podcasts.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export default async function Home() {
  const podcastsData = await getPodcasts();

  return (
    <MuseumLayout>
      <GalleryContent podcasts={podcastsData} />
    </MuseumLayout>
  );
}
