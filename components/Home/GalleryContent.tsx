"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GalleryCard from '@/components/UI/GalleryCard';

interface Podcast {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
}

export default function GalleryContent({ podcasts }: { podcasts: Podcast[] }) {
    return (
        <>
            <section className="mb-12 text-center">
                <motion.h1
                    className="text-5xl md:text-7xl font-serif font-bold text-museum-text mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Voces <span className="text-museum-gold">Curadas</span>
                </motion.h1>
                <motion.p
                    className="text-xl text-gray-400 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Explora diálogos educativos sobre Arte, Arquitectura y Diseño, generados por NotebookLM y curados por Francisco.
                </motion.p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {podcasts.map((podcast, index) => (
                    <motion.div
                        key={podcast.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    >
                        <GalleryCard
                            id={podcast.id}
                            title={podcast.title}
                            description={podcast.description}
                            category={podcast.category}
                            imageUrl={podcast.imageUrl}
                        />
                    </motion.div>
                ))}
            </div>
        </>
    );
}
