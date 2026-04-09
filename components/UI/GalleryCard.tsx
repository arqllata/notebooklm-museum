"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GalleryCardProps {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ id, title, description, category, imageUrl }) => {
    const [imageError, setImageError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("¿Estás seguro de que deseas eliminar este podcast?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/podcasts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Error al eliminar.");
            }
        } catch (error) {
            alert("Error al eliminar el podcast.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            className="group relative bg-museum-card rounded-lg overflow-hidden border border-white/5 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ease-out"
            whileHover={{ y: -5, scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Link href={`/podcast/${id}/`} className="block h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-800">
                    {!imageError && imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 text-center">
                            <span className="text-gray-600 font-serif italic text-lg mb-2">Imagen no disponible</span>
                            <span className="text-xs text-gray-700">({title})</span>
                        </div>
                    )}

                    {/* Overlay with Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <motion.div
                            className="w-16 h-16 rounded-full bg-museum-gold/90 flex items-center justify-center backdrop-blur-sm shadow-xl"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Play className="ml-1 text-museum-bg fill-current" size={28} />
                        </motion.div>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-medium tracking-wider text-white uppercase border border-white/10 rounded-sm">
                            {category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-museum-text group-hover:text-museum-gold transition-colors duration-300 mb-2 line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>
            </Link>

            {/* Admin Controls (Absolute Positioned) */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <Link
                    href={`/studio/edit/${id}`}
                    className="p-2 bg-black/60 hover:bg-museum-gold text-white hover:text-museum-bg rounded-md backdrop-blur-md transition-colors border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                    title="Editar Podcast"
                >
                    <Edit size={16} />
                </Link>
                <button
                    onClick={handleDelete}
                    className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-md backdrop-blur-md transition-colors border border-white/10"
                    title="Eliminar Podcast"
                    disabled={isDeleting}
                >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
            </div>
        </motion.div>
    );
};

export default GalleryCard;
