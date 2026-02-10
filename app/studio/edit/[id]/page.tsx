"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MuseumLayout from '@/components/Layout/MuseumLayout';
import { Save, ArrowLeft, Loader2, AlertCircle, CheckCircle, Upload, Image as ImageIcon, Music } from 'lucide-react';
import Link from 'next/link';

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default function EditPodcastPage({ params }: EditPageProps) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        currentImageUrl: '',
        currentAudioUrl: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/podcasts/${id}`);
                if (!res.ok) throw new Error("Failed to fetch podcast");
                const data = await res.json();
                setFormData({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    currentImageUrl: data.imageUrl,
                    currentAudioUrl: data.audioUrl
                });
            } catch (err) {
                setError("Could not load podcast details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setUploadProgress(0);
        setError('');
        setSuccess('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        if (imageFile) data.append('image', imageFile);
        if (audioFile) data.append('audio', audioFile);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadProgress(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setSuccess("Changes saved successfully!");
                setTimeout(() => {
                    router.push('/');
                    router.refresh();
                }, 1500);
            } else {
                setError("Failed to save changes. Please try again.");
                setIsSaving(false);
            }
        };

        xhr.onerror = () => {
            setError("Network error occurred.");
            setIsSaving(false);
        };

        xhr.open('PUT', `/api/podcasts/${id}`);
        xhr.send(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return (
            <MuseumLayout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader2 className="animate-spin text-museum-gold" size={48} />
                </div>
            </MuseumLayout>
        );
    }

    return (
        <MuseumLayout>
            <div className="max-w-2xl mx-auto py-12 px-4">
                <div className="mb-8">
                    <Link href="/" className="text-gray-400 hover:text-white flex items-center mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Volver a la Galería
                    </Link>
                    <h1 className="text-3xl font-serif text-white">Editar <span className="text-museum-gold">Podcast</span></h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-museum-card border border-white/5 rounded-xl p-8"
                >
                    {success ? (
                        <div className="text-center py-10">
                            <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                            <h3 className="text-xl text-white">¡Guardado!</h3>
                            <p className="text-gray-400">Redirigiendo a la galería...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Image Upload/Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Portada</label>
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-museum-gold/50 transition-colors bg-black/20">
                                    {imageFile ? (
                                        <div className="text-museum-gold flex items-center justify-center">
                                            <ImageIcon className="mr-2" />
                                            <span>Nueva imagen seleccionada: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                    ) : formData.currentImageUrl ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden w-full max-w-xs mx-auto">
                                            <img src={formData.currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <p className="text-sm text-gray-200">Clic abajo para cambiar</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">Sin imagen</div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-museum-gold file:text-museum-bg hover:file:bg-white transition-colors"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Deja vacío para mantener la imagen actual.</p>
                                </div>
                            </div>

                            {/* Audio Upload/Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Archivo de Audio</label>
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-museum-gold/50 transition-colors bg-black/20">
                                    {audioFile ? (
                                        <div className="text-museum-gold flex items-center justify-center">
                                            <Music className="mr-2" />
                                            <span>Nuevo audio seleccionado: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <p className="mb-2">Audio Actual: <span className="text-white/70 italic">{(formData.currentAudioUrl || '').split('/').pop()}</span></p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                        className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-museum-gold file:text-museum-bg hover:file:bg-white transition-colors"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Deja vacío para mantener el audio actual.</p>
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-museum-bg border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-museum-gold outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-museum-bg border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-museum-gold outline-none"
                                >
                                    <option value="Art History">Historia del Arte</option>
                                    <option value="Architecture">Arquitectura</option>
                                    <option value="Design">Diseño</option>
                                    <option value="Philosophy">Filosofía</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full bg-museum-bg border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-museum-gold outline-none"
                                />
                            </div>

                            {/* Progress Bar */}
                            {isSaving && (
                                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                                    <div
                                        className="bg-museum-gold h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                    <p className="text-xs text-center text-gray-400 mt-1">{uploadProgress}% Subido</p>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 bg-red-900/20 text-red-200 rounded text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <Link href="/" className="px-6 py-3 text-gray-400 hover:text-white transition-colors">
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-museum-gold hover:bg-museum-gold-dim text-museum-bg font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </MuseumLayout>
    );
}
