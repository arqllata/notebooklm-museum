"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LibraryBig, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                password: accessCode,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid Access Code. Please try again.');
                setIsLoading(false);
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-museum-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-museum-card/50 via-museum-bg to-museum-bg opacity-50 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-museum-card border border-white/5 p-8 rounded-2xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-museum-gold/10 rounded-full mb-4"
                    >
                        <LibraryBig size={32} className="text-museum-gold" />
                    </motion.div>
                    <h1 className="text-3xl font-serif font-bold text-museum-text mb-2">Restricted Access</h1>
                    <p className="text-gray-400 text-sm">Please enter your student access code to enter the museum.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="accessCode" className="block text-sm font-medium text-gray-300">
                            Access Code
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Lock size={18} />
                            </div>
                            <input
                                id="accessCode"
                                type="password"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-museum-bg border border-white/10 rounded-lg focus:ring-2 focus:ring-museum-gold focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-400 text-sm text-center bg-red-900/10 p-2 rounded-md border border-red-900/20"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-3 px-4 bg-museum-gold hover:bg-museum-gold-dim text-museum-bg font-bold rounded-lg transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                Enter Museum <ArrowRight size={18} className="ml-2" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Mock Access Code: <span className="text-gray-400 font-mono bg-white/5 px-2 py-1 rounded">art101</span></p>
                </div>
            </motion.div>
        </div>
    );
}
