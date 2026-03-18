"use client";

import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface PhotoGalleryProps {
    images: string[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 border-t border-white/10 pt-12">
            <h3 className="font-serif text-2xl text-museum-text mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                Galería del Episodio
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-black/40 border border-white/5"
                        onClick={() => setSelectedImage(img)}
                    >
                        <img
                            src={img}
                            alt={`Galería ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="text-white/80" size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Vista ampliada"
                        className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
}
