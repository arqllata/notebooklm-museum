// export const dynamic = 'force-dynamic';

import React from 'react';
import { getPodcasts } from '@/components/lib/podcasts';
import MuseumLayout from '@/components/Layout/MuseumLayout';
import GalleryContent from '@/components/Home/GalleryContent';



export default async function Home() {
  const podcastsData = await getPodcasts();

  return (
    <MuseumLayout>
      <GalleryContent podcasts={podcastsData as any} />
    </MuseumLayout>
  );
}
