"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import mapData from "../../app/data/mapData.json";
import TimeSlider from "./TimeSlider";

// GeoJSON global ultra-ligero que usa react-simple-maps por defecto para pintar los países
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface Movement {
  id: string | number;
  movement: string;
  startYear: number;
  endYear: number;
  locationName: string;
  longitude: number;
  latitude: number;
  keyFigures: string;
  keyArtworks: string;
  description: string;
}

export default function TimelineMap() {
  const [currentYear, setCurrentYear] = useState(1850);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showArtworks, setShowArtworks] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  
  // Extraer min y max dinámico del JSON (Ej. -10000 a 2026)
  const [minYear, maxYear] = useMemo(() => {
    let min = 1850;
    let max = new Date().getFullYear();
    mapData.forEach((m: any) => {
      if (m.startYear < min) min = m.startYear;
    });
    return [min, max];
  }, []);

  // Lógica de reproducción automática en el tiempo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(y => {
          if (y >= maxYear) {
            setIsPlaying(false);
            return y;
          }
          // Avanzar saltando de a pocos años para que no sea eterno desde el -10000
          const increment = y < 1000 ? 50 : y < 1800 ? 10 : 2; 
          return y + increment;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxYear]);

  // Filtrar movimientos que están "vivos" en el año actual
  const activeMovements = useMemo(() => {
    return (mapData as Movement[]).filter(
      (m) => currentYear >= m.startYear && currentYear <= m.endYear
    );
  }, [currentYear]);

  // Color palette for the blobs
  const VIBRANT_COLORS = [
    "#ef4444", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#f43f5e"
  ];
  
  const getColorForId = (id: string | number) => {
    const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return VIBRANT_COLORS[hash % VIBRANT_COLORS.length];
  };

  // Memoize base geometries to heavily optimize render performance
  const baseMapGeometries = useMemo(() => (
    <Geographies geography={geoUrl}>
      {({ geographies }: any) =>
        geographies.map((geo: any) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#111116" 
            stroke="#27272a" 
            strokeWidth={0.5}
            style={{
              default: { outline: "none" },
              hover: { fill: "#1f1f26", outline: "none", transition: "all 0.3s" },
              pressed: { outline: "none" },
            }}
          />
        ))
      }
    </Geographies>
  ), []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-tr from-zinc-950 via-[#0a0a0c] to-zinc-900 overflow-hidden font-sans">
      
      {/* HEADER COCKPIT */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-2 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow subyacente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-4xl text-white font-bold tracking-tight">Timeline del Museo</h1>
          <p className="text-zinc-400 text-sm max-w-sm">
            Observa cómo las vanguardias y estilos artísticos se despliegan magnéticamente a lo largo del tiempo y el espacio.
          </p>
          
          {/* Toggle Obras (A futuro) */}
          <button 
            onClick={() => setShowArtworks(!showArtworks)}
            className={`mt-4 w-max px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${showArtworks ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white border border-white/5'}`}
          >
            {showArtworks ? "Ocultar Detalles de Obras" : "Mostrar Obras Clave"}
          </button>
        </div>
      </div>

      {/* MAPA MUNDIAL */}
      <div className="w-full h-[85vh] flex items-center justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140 }}
          className="w-full h-full opacity-80"
        >
          <ZoomableGroup 
            zoom={1.5} 
            center={[15, 20]} 
            minZoom={1} 
            maxZoom={8}
            filterZoomEvent={(e: any) => {
              if (e.type === 'wheel') {
                return e.ctrlKey || e.metaKey; // Sólo hacer zoom con scroll si presiona Control/Command
              }
              return true;
            }}
          >
            {/* Capas Geográficas base memoizadas */}
            {baseMapGeometries}

            {/* CAPA DE MANCHAS DE LOS MOVIMIENTOS ARTÍSTICOS */}
            <AnimatePresence>
              {activeMovements.map((mov) => {
                // Calculamos el ciclo de vida: 0 (nace) -> 1 (apogeo) -> 0.2 (muere lentamente)
                const lifespan = mov.endYear - mov.startYear || 1;
                const currentAge = currentYear - mov.startYear;
                const ratio = Math.min(Math.max(currentAge / lifespan, 0), 1);
                
                // Animación del radio (surge rápido y se asienta)
                const radius = ratio < 0.2 ? 15 + (ratio * 100) : 35;

                const isHovered = hoveredId === mov.id;
                const showLabel = isHovered || ratio < 0.15;

                return (
                  <Marker 
                    key={mov.id} 
                    coordinates={[mov.longitude, mov.latitude]}
                    onMouseEnter={() => setHoveredId(mov.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Mancha expansiva abstracta */}
                    <motion.circle
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ 
                        r: isHovered ? radius * 1.2 : radius, 
                        opacity: isHovered ? 0.9 : (ratio < 0.2 ? 0.7 : (1 - ratio) * 0.8) 
                      }}
                      exit={{ r: 0, opacity: 0, transition: { duration: 0.5 } }}
                      fill={getColorForId(mov.id)} 
                      style={{ mixBlendMode: 'screen', filter: 'blur(8px)' }}
                    />
                    {/* Etiqueta flotante minimalista */}
                    <motion.text
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: showLabel ? 1 : 0, y: 0, scale: isHovered ? 1.2 : 1 }}
                      exit={{ opacity: 0 }}
                      textAnchor="middle"
                      y={-15}
                      style={{ 
                        fontFamily: "Inter, sans-serif", 
                        fill: "#fff", 
                        fontSize: 8, 
                        fontWeight: 600, 
                        letterSpacing: 1,
                        pointerEvents: "none",
                        textShadow: "0px 2px 10px rgba(0,0,0,0.8)"
                      }}
                    >
                      {mov.movement.toUpperCase()}
                    </motion.text>

                    {/* Capa de Obras (Si el usuario la activa) */}
                    {showArtworks && mov.keyArtworks && ratio > 0.1 && (
                       <motion.text
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 0.6 }}
                         exit={{ opacity: 0 }}
                         textAnchor="middle"
                         y={15}
                         style={{ fontFamily: "Inter, sans-serif", fill: "#d4d4d8", fontSize: 6, fontStyle: "italic" }}
                       >
                         📌 {mov.keyArtworks.split(',')[0].substring(0,25)}...
                       </motion.text>
                    )}
                  </Marker>
                );
              })}
            </AnimatePresence>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* LINEA DE TIEMPO INTERACTIVA */}
      <TimeSlider 
        currentYear={currentYear}
        minYear={minYear}
        maxYear={maxYear}
        onChange={setCurrentYear}
        isPlaying={isPlaying}
        togglePlay={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}
