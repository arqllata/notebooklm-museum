"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
    src: string;
    title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds;
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="bg-museum-card border border-white/5 rounded-xl p-6 shadow-2xl backdrop-blur-md">
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Title */}
            {title && (
                <h3 className="text-museum-gold font-serif text-lg mb-4 text-center">{title}</h3>
            )}

            {/* Progress Bar */}
            <div className="mb-6 group">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-museum-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-125"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                {/* Volume */}
                <div className="w-1/4 hidden md:flex items-center gap-2">
                    <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setVolume(val);
                            if (audioRef.current) audioRef.current.volume = val;
                            setIsMuted(val === 0);
                        }}
                        className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full"
                    />
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-6 w-full md:w-auto">
                    <button onClick={() => skip(-10)} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                        <RotateCcw size={20} />
                    </button>

                    <motion.button
                        onClick={togglePlay}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 bg-museum-gold text-museum-bg rounded-full flex items-center justify-center shadow-lg hover:bg-museum-gold-dim transition-colors"
                    >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </motion.button>

                    <button onClick={() => skip(10)} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                        <RotateCw size={20} />
                    </button>
                </div>

                {/* Spacer / Additional settings */}
                <div className="w-1/4 hidden md:block"></div>
            </div>
        </div>
    );
};

export default AudioPlayer;
