import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import MuseumLayout from '@/components/Layout/MuseumLayout';
import AudioPlayer from '@/components/Player/AudioPlayer';
import { getPodcast, getPodcasts } from '@/components/lib/podcasts';
import path from 'path';
import PhotoGallery from '@/components/Podcast/PhotoGallery';
import KeyTakeaways from '@/components/Podcast/KeyTakeaways';
import TriviaQuiz from '@/components/Podcast/TriviaQuiz';
import InfographicViewer from '@/components/Podcast/InfographicViewer';
import { FileText, Download } from 'lucide-react';
// Force dynamic rendering to ensure we always get the latest JSON data
// export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const podcasts = await getPodcasts();

    return podcasts.map((podcast: any) => ({
        id: podcast.id,
    }));
}

export default async function PodcastPage({ params }: PageProps) {
    const { id } = await params;
    const podcast = await getPodcast(id);

    if (!podcast) {
        notFound();
    }

    return (
        <MuseumLayout>
            {/* Animations removed from Server Component wrapper - can be re-added via a Client Component wrapper if needed, 
                 but for checking data fixes, standard rendering is safer/faster. 
                 Keeping it simple for "Museum Quality" static feel. */}
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-museum-gold hover:text-white transition-colors mb-8 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver a la Galería
                </Link>

                <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
                    {/* Cover Art */}
                    <div className="aspect-square rounded-lg overflow-hidden border border-white/10 shadow-2xl relative">
                        {podcast.imageUrl ? (
                            <img src={podcast.imageUrl} alt={podcast.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-500 italic">Sin Portada</span>
                            </div>
                        )}
                    </div>

                    {/* Header Info */}
                    <div className="flex flex-col justify-center">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-museum-gold/20 text-museum-gold text-xs font-bold uppercase tracking-widest rounded-full border border-museum-gold/30">
                                    {podcast.category}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-museum-text mb-6 leading-tight">
                                {podcast.title}
                            </h1>

                            <div className="flex items-center gap-6 text-sm text-gray-400 font-mono mb-8">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>15 min</span> {/* Placeholder */}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>2024</span> {/* Placeholder */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Player Section */}
                <div className="mb-12">
                    <AudioPlayer src={podcast.audioUrl} title={podcast.title} />
                </div>

                {/* Description & Notes */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <h2 className="font-serif text-3xl text-museum-text mb-6">Sobre este episodio</h2>
                    <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                        {podcast.description}
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Este episodio fue generado por NotebookLM, analizando textos clave para proveer una síntesis educativa. Explora los matices del tema con profundidad y claridad, curado por Francisco.
                    </p>

                    {/* Puntos Clave */}
                    <KeyTakeaways points={podcast.takeaways} />

                    {/* Galería de Fotos */}
                    <PhotoGallery images={podcast.gallery} />

                    {/* Infografía */}
                    <InfographicViewer imageUrl={podcast.infographicUrl} />

                    {/* Apuntes de Clase PDF */}
                    {podcast.classNotesUrl && (
                        <div className="mt-12 bg-museum-gold/5 border border-museum-gold/20 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-left">
                                <div className="p-3 bg-museum-gold/10 rounded-full flex-shrink-0">
                                    <FileText className="text-museum-gold" size={28} />
                                </div>
                                <div>
                                    <h3 className="font-serif text-2xl text-museum-text mb-1 mt-0">Apuntes de la Sesión</h3>
                                    <p className="text-gray-400 text-sm m-0">Descarga el documento en formato PDF con toda la información clave de este episodio.</p>
                                </div>
                            </div>
                            <a 
                                href={podcast.classNotesUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex flex-shrink-0 items-center justify-center gap-2 bg-museum-gold text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-colors no-underline"
                            >
                                <Download size={18} />
                                <span>Descargar PDF</span>
                            </a>
                        </div>
                    )}

                    {/* Trivia Interactiva */}
                    <TriviaQuiz questions={podcast.quiz} />
                </div>
            </div>

        </MuseumLayout >
    );
}
