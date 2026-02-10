"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import MuseumLayout from '@/components/Layout/MuseumLayout';
import { Upload, Music, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

export default function StudioPage() {
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    // File State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    // Drag State
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [isDraggingAudio, setIsDraggingAudio] = useState(false);

    // Drag Handlers
    const handleDrag = useCallback((e: React.DragEvent, type: 'image' | 'audio', isOver: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (type === 'image') setIsDraggingImage(isOver);
        if (type === 'audio') setIsDraggingAudio(isOver);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, type: 'image' | 'audio') => {
        e.preventDefault();
        e.stopPropagation();

        if (type === 'image') setIsDraggingImage(false);
        if (type === 'audio') setIsDraggingAudio(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (type === 'image' && file.type.startsWith('image/')) {
                setImageFile(file);
            } else if (type === 'audio' && (file.type.startsWith('audio/') || file.type === 'video/mp4')) {
                setAudioFile(file);
            }
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'image') setImageFile(e.target.files[0]);
            if (type === 'audio') setAudioFile(e.target.files[0]);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!imageFile || !audioFile) {
            setErrorMessage("Please upload both an image and an audio file.");
            setStatus('error');
            return;
        }

        setStatus('uploading');
        setUploadProgress(0);

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.set('image', imageFile);
        formData.set('audio', audioFile);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadProgress(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setStatus('success');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setStatus('error');
                setErrorMessage("Upload failed. Please try again.");
            }
        };

        xhr.onerror = () => {
            setStatus('error');
            setErrorMessage("Network error occurred.");
        };

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
    }

    return (
        <MuseumLayout>
            <div className="max-w-2xl mx-auto py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-serif font-bold text-museum-text mb-4">Estudio de <span className="text-museum-gold">Curaduría</span></h1>
                    <p className="text-gray-400">Sube nuevas adquisiciones a la colección del museo.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-museum-card border border-white/5 rounded-2xl p-8 shadow-xl"
                >
                    {status === 'success' ? (
                        <div className="text-center py-12">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle size={40} />
                            </motion.div>
                            <h3 className="text-2xl font-serif text-white mb-2">Adquisición Completa</h3>
                            <p className="text-gray-400">El nuevo podcast ha sido añadido a la galería.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                                <input required name="title" type="text" className="w-full bg-museum-bg border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-museum-gold outline-none transition-all" placeholder="Ej: El Movimiento Bauhaus" />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                                <select name="category" className="w-full bg-museum-bg border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-museum-gold outline-none transition-all">
                                    <option value="Art History">Historia del Arte</option>
                                    <option value="Architecture">Arquitectura</option>
                                    <option value="Design">Diseño</option>
                                    <option value="Philosophy">Filosofía</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                                <textarea required name="description" rows={4} className="w-full bg-museum-bg border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-museum-gold outline-none transition-all" placeholder="Un breve resumen del episodio..." />
                            </div>

                            {/* Files */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Image Drop Zone */}
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white/5 relative ${isDraggingImage ? 'border-museum-gold bg-museum-gold/10' : 'border-white/10 hover:border-museum-gold/50'}`}
                                    onDragOver={(e) => handleDrag(e, 'image', true)}
                                    onDragLeave={(e) => handleDrag(e, 'image', false)}
                                    onDrop={(e) => handleDrop(e, 'image')}
                                >
                                    {imageFile ? (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <CheckCircle className="text-green-400 mb-2" size={32} />
                                            <p className="text-sm text-white font-medium truncate w-full px-2">{imageFile.name}</p>
                                            <button type="button" onClick={() => setImageFile(null)} className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center">
                                                <X size={12} className="mr-1" /> Eliminar
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="mx-auto text-gray-400 mb-3" size={24} />
                                            <label className="block text-sm font-medium text-museum-gold cursor-pointer hover:underline">
                                                Subir Portada
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG (Arrastrar y Soltar)</p>
                                        </>
                                    )}
                                </div>

                                {/* Audio Drop Zone */}
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white/5 relative ${isDraggingAudio ? 'border-museum-gold bg-museum-gold/10' : 'border-white/10 hover:border-museum-gold/50'}`}
                                    onDragOver={(e) => handleDrag(e, 'audio', true)}
                                    onDragLeave={(e) => handleDrag(e, 'audio', false)}
                                    onDrop={(e) => handleDrop(e, 'audio')}
                                >
                                    {audioFile ? (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <CheckCircle className="text-green-400 mb-2" size={32} />
                                            <p className="text-sm text-white font-medium truncate w-full px-2">{audioFile.name}</p>
                                            <button type="button" onClick={() => setAudioFile(null)} className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center">
                                                <X size={12} className="mr-1" /> Eliminar
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Music className="mx-auto text-gray-400 mb-3" size={24} />
                                            <label className="block text-sm font-medium text-museum-gold cursor-pointer hover:underline">
                                                Subir Audio
                                                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileSelect(e, 'audio')} />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">MP3, WAV (Arrastrar y Soltar)</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> {errorMessage}
                                </div>
                            )}

                            {/* Progress Bar */}
                            {status === 'uploading' && (
                                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="h-full bg-museum-gold"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                                        {uploadProgress}%
                                    </span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'uploading'}
                                className="w-full py-4 bg-museum-gold hover:bg-museum-gold-dim text-museum-bg font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'uploading' ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                                {status === 'uploading' ? 'Subiendo...' : 'Publicar en Galería'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </MuseumLayout>
    );
}
