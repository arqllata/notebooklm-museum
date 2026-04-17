"use client";

import dynamic from 'next/dynamic';

const TimelineMap = dynamic(() => import('./TimelineMap'), {
  ssr: false,
  loading: () => <div className="text-white p-10 flex w-full h-screen items-center justify-center">Cargando el Mapamundi del Museo...</div>
});

export default function TimelineMapWrapper() {
  return <TimelineMap />;
}
