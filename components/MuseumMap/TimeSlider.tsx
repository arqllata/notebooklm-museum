"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimeSliderProps {
  currentYear: number;
  minYear: number;
  maxYear: number;
  onChange: (year: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
}

export default function TimeSlider({
  currentYear,
  minYear,
  maxYear,
  onChange,
  isPlaying,
  togglePlay,
}: TimeSliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-3xl border-t border-white/10 p-6 pb-10 flex flex-col gap-6 fixed bottom-0 left-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Botones y Año Actual */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center bg-white text-black p-4 rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
          aria-label={isPlaying ? "Pausar línea de tiempo" : "Reproducir línea de tiempo"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="text-center">
          <motion.div
            key={currentYear}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-light text-white tracking-tighter"
          >
            {currentYear < 0 ? `${Math.abs(currentYear)} a.C.` : currentYear}
          </motion.div>
          <div className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Línea de Vida Visual</div>
        </div>

        {/* Espacio vacío para balancear el flex-between */}
        <div className="w-[48px]"></div> 
      </div>

      {/* Rango (Slider) */}
      <div className="relative w-full group">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={handleSliderChange}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer outline-none overflow-hidden"
          style={{
            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(currentYear - minYear) / (maxYear - minYear) * 100}%, #27272a ${(currentYear - minYear) / (maxYear - minYear) * 100}%, #27272a 100%)`
          }}
        />
        
        {/* Estilos CSS Nativos del Thumb para que no se vea el circulito feo de HTML */}
        <style dangerouslySetInnerHTML={{__html: `
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            border: 2px solid #000;
            box-shadow: 0 0 15px rgba(255,255,255,0.6);
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          input[type='range']:hover::-webkit-slider-thumb {
            transform: scale(1.4);
            box-shadow: 0 0 20px rgba(255,255,255,1);
          }
        `}} />
      </div>
    </div>
  );
}
