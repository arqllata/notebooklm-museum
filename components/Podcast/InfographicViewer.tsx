"use client";

import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

interface InfographicViewerProps {
    imageUrl: string;
}

export default function InfographicViewer({ imageUrl }: InfographicViewerProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!imageUrl) return null;

    return (
        <div className="mb-12">
            <h3 className="font-serif text-2xl text-museum-text mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                Infografía del Episodio
            </h3>

            <div className="relative group cursor-pointer border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-black/40">
                <img
                    src={imageUrl}
                    alt="Infografía Educativa"
                    className="w-full max-h-[600px] object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
                    onClick={() => setIsOpen(true)}
                />

                {/* Overlay Hint */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsOpen(true)}
                >
                    <button className="flex items-center gap-2 bg-museum-gold text-black px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Maximize2 size={18} />
                        Ver Infografía Completa
                    </button>
                </div>
            </div>

            {/* Full Screen Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] bg-black/95 overflow-y-auto p-4 md:p-8 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto relative">
                        <button
                            className="fixed top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-[70]"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={32} />
                        </button>

                        <img
                            src={imageUrl}
                            alt="Infografía Completa"
                            className="w-full h-auto rounded-lg shadow-2xl border border-white/10"
                        />

                        <div className="text-center mt-8 pb-12">
                            <button
                                className="text-gray-400 hover:text-white underline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cerrar Infografía
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
