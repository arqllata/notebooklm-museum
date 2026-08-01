"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Zap, Sliders, Plus, Search, 
  Sparkles, Layers, Filter, ArrowRight, 
  Trash2, X, Check, Activity, ShieldAlert,
  GitCommit, Hourglass, Landmark, HelpCircle,
  Eye, Cpu
} from "lucide-react";
import initialNodes from "@/app/data/nodos_cognitivos.json";

interface BioTrunk {
  dinamica_dmn_ecn: string;
  hipofrontalidad_transitoria: string;
  carga_noradrenergica: string;
}

interface ContextMatrix {
  estresores_multidimensionales: string[];
  ingesta_epistemologica: string[];
}

interface MorphologicalOffloading {
  tecnologias_de_descarga: string[];
  reglas_de_saliencia_estetica: string[];
  nivel_de_abstraccion_material: number;
  vectores_de_bisociacion: string[];
}

interface CognitiveNode {
  id_nodo: string;
  movimiento: string;
  genealogia_abductiva: string[];
  capa_1_tronco_biologico: BioTrunk;
  capa_2_matriz_contextual: ContextMatrix;
  capa_3_descarga_morfologica: MorphologicalOffloading;
  variables_singulares?: Record<string, string>;
  mecanismo_de_infeccion_cultural?: string;
}

export default function LaboratoryDashboard() {
  const [nodes, setNodes] = useState<CognitiveNode[]>(initialNodes as unknown as CognitiveNode[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [epistemologyFilter, setEpistemologyFilter] = useState("todos");
  const [minAbstraction, setMinAbstraction] = useState(1);
  const [selectedNodesForComparison, setSelectedNodesForComparison] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'bio' | 'context' | 'morph'>>({});
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Referencias para scroll automático al hacer clic en el grafo
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  // Formulario para añadir nuevos movimientos con el nuevo esquema
  const [form, setForm] = useState({
    id_nodo: "",
    movimiento: "",
    genealogia_abductiva: "",
    dinamica_dmn_ecn: "",
    hipofrontalidad_transitoria: "",
    carga_noradrenergica: "",
    estresores_multidimensionales: "",
    ingesta_epistemologica: "",
    tecnologias_de_descarga: "",
    reglas_de_saliencia_estetica: "",
    nivel_de_abstraccion_material: 5,
    vectores_de_bisociacion: "",
    variables_singulares: "" // Llave: Valor, Llave2: Valor2
  });

  // Cargar nodos dinámicamente desde la API local en el arranque
  useEffect(() => {
    fetch("/api/nodos")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Fallo al obtener nodos de la API");
      })
      .then((data) => {
        if (data && data.length > 0) {
          setNodes(data);
        }
      })
      .catch((err) => console.log("Usando nodos de respaldo local:", err));
  }, []);

  // Extraer las fuentes epistemológicas dominantes para el selector de filtros
  const uniqueEpistemologies = useMemo(() => {
    const list = nodes.map(n => n.capa_1_tronco_biologico.dinamica_dmn_ecn.split(".")[0]).filter(Boolean);
    const customList = ["todos", "DMN dominante", "ECN dominante", "Desacople traumático"];
    return customList;
  }, [nodes]);

  // Filtrado reactivo multidimensional
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = 
        node.movimiento.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.capa_3_descarga_morfologica.vectores_de_bisociacion.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.capa_3_descarga_morfologica.tecnologias_de_descarga.join(" ").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEpistemology = 
        epistemologyFilter === "todos" || 
        (epistemologyFilter === "DMN dominante" && node.capa_1_tronco_biologico.dinamica_dmn_ecn.toLowerCase().includes("dmn")) ||
        (epistemologyFilter === "ECN dominante" && node.capa_1_tronco_biologico.dinamica_dmn_ecn.toLowerCase().includes("ecn")) ||
        (epistemologyFilter === "Desacople traumático" && node.capa_1_tronco_biologico.dinamica_dmn_ecn.toLowerCase().includes("desacople"));
      
      const matchesAbstraction = node.capa_3_descarga_morfologica.nivel_de_abstraccion_material >= minAbstraction;

      return matchesSearch && matchesEpistemology && matchesAbstraction;
    });
  }, [nodes, searchQuery, epistemologyFilter, minAbstraction]);

  // Alternar comparación de nodos
  const toggleComparison = (id: string) => {
    setSelectedNodesForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const comparisonNodes = useMemo(() => {
    return nodes.filter(n => selectedNodesForComparison.includes(n.id_nodo));
  }, [nodes, selectedNodesForComparison]);

  // Enviar nuevo movimiento a la API local (persistencia)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Parsear campos complejos en arreglos limpios
    const genealogia = form.genealogia_abductiva.split(",").map(s => s.trim()).filter(Boolean);
    const estresores = form.estresores_multidimensionales.split(",").map(s => s.trim()).filter(Boolean);
    const ingesta = form.ingesta_epistemologica.split(",").map(s => s.trim()).filter(Boolean);
    const tech = form.tecnologias_de_descarga.split(",").map(s => s.trim()).filter(Boolean);
    const saliencia = form.reglas_de_saliencia_estetica.split(",").map(s => s.trim()).filter(Boolean);
    const bisociacion = form.vectores_de_bisociacion.split(";").map(s => s.trim()).filter(Boolean);

    // Parsear variables singulares del formato "Llave: Valor"
    const singulares: Record<string, string> = {};
    if (form.variables_singulares.trim()) {
      form.variables_singulares.split(",").forEach((item) => {
        const parts = item.split(":");
        if (parts.length >= 2) {
          const k = parts[0].trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
          const v = parts.slice(1).join(":").trim();
          singulares[k] = v;
        }
      });
    }

    // Extraer año aproximado de inicio del ID o movimiento
    const matchYear = form.id_nodo.match(/\d{4}/);
    const year = matchYear ? Number(matchYear[0]) : 1910;

    const newNode: CognitiveNode = {
      id_nodo: form.id_nodo || "VANG_" + form.movimiento.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "_" + year,
      movimiento: form.movimiento,
      genealogia_abductiva: genealogia,
      capa_1_tronco_biologico: {
        dinamica_dmn_ecn: form.dinamica_dmn_ecn,
        hipofrontalidad_transitoria: form.hipofrontalidad_transitoria,
        carga_noradrenergica: form.carga_noradrenergica
      },
      capa_2_matriz_contextual: {
        estresores_multidimensionales: estresores,
        ingesta_epistemologica: ingesta
      },
      capa_3_descarga_morfologica: {
        tecnologias_de_descarga: tech,
        reglas_de_saliencia_estetica: saliencia,
        nivel_de_abstraccion_material: Number(form.nivel_de_abstraccion_material),
        vectores_de_bisociacion: bisociacion
      },
      variables_singulares: singulares
    };

    try {
      const res = await fetch("/api/nodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNode)
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage(`¡Nodo cognitivo "${newNode.movimiento}" persistido con éxito en el mapa!`);
        setNodes(result.nodes);
        setIsAddModalOpen(false);
        setForm({
          id_nodo: "",
          movimiento: "",
          genealogia_abductiva: "",
          dinamica_dmn_ecn: "",
          hipofrontalidad_transitoria: "",
          carga_noradrenergica: "",
          estresores_multidimensionales: "",
          ingesta_epistemologica: "",
          tecnologias_de_descarga: "",
          reglas_de_saliencia_estetica: "",
          nivel_de_abstraccion_material: 5,
          vectores_de_bisociacion: "",
          variables_singulares: ""
        });
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        throw new Error(result.error || "Fallo en el servidor.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar.");
    }
  };

  // Coordenadas calculadas en 2D para cada nodo en el Grafo SVG
  // X: Tiempo (Mapeado de 1890 a 1935 en píxeles del SVG)
  // Y: Abstracción material (Mapeado de 1 a 10 en píxeles del SVG)
  const nodeGraphPositions = useMemo(() => {
    const width = 800;
    const height = 300;
    const padding = 60;

    const minYear = 1890;
    const maxYear = 1930;

    return nodes.map((node) => {
      // Extraer año de inicio de los estresores o del ID
      const matchYear = node.id_nodo.match(/\d{4}/);
      const year = matchYear ? Number(matchYear[0]) : 1910;
      
      const x = padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
      const y = height - padding - ((node.capa_3_descarga_morfologica.nivel_de_abstraccion_material - 1) / 9) * (height - 2 * padding);

      return {
        id: node.id_nodo,
        name: node.movimiento,
        year,
        abstraction: node.capa_3_descarga_morfologica.nivel_de_abstraccion_material,
        x,
        y,
        epistemology: node.capa_2_matriz_contextual.ingesta_epistemologica[0] || "Racionalismo",
        dmnScore: node.capa_1_tronco_biologico.dinamica_dmn_ecn.toLowerCase().includes("dmn") ? 0.8 : 0.3
      };
    });
  }, [nodes]);

  // Manejar clic en nodo del grafo (Scroll dinámico e interactivo)
  const handleGraphNodeClick = (id: string) => {
    const element = cardRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Parpadeo visual de alta prioridad
      element.classList.add("ring-4", "ring-indigo-500", "ring-offset-4", "ring-offset-[#050507]");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-indigo-500", "ring-offset-4", "ring-offset-[#050507]");
      }, 2000);
    }
  };

  // Dibujar las líneas sinápticas (conexiones de linaje) en el grafo SVG
  const graphConnections = useMemo(() => {
    const lines: Array<{
      id: string;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      highlighted: boolean;
    }> = [];

    // Mapear conexiones basadas en genealogía abductiva
    nodeGraphPositions.forEach((node) => {
      const fullNode = nodes.find(n => n.id_nodo === node.id);
      if (fullNode && fullNode.genealogia_abductiva) {
        fullNode.genealogia_abductiva.forEach((lineage) => {
          // Si el linaje contiene palabras clave de otro nodo, dibujamos la conexión
          nodeGraphPositions.forEach((otherNode) => {
            if (otherNode.id !== node.id && lineage.toLowerCase().includes(otherNode.name.toLowerCase().substring(0, 5))) {
              const isHighlighted = hoveredNodeId === node.id || hoveredNodeId === otherNode.id;
              lines.push({
                id: `${node.id}-${otherNode.id}`,
                fromX: otherNode.x,
                fromY: otherNode.y,
                toX: node.x,
                toY: node.y,
                highlighted: isHighlighted
              });
            }
          });
        });
      }
    });

    return lines;
  }, [nodeGraphPositions, nodes, hoveredNodeId]);

  return (
    <div className="relative min-h-screen flex flex-col p-8 gap-8">
      {/* GLOWS DE FONDO */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* HEADER COCKPIT */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/5 relative z-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Brain size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Laboratorio de Correlación Cognitiva
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono tracking-widest uppercase border border-indigo-500/20">Fase 2 Refinada</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl font-mono">
              Ecosistema Antigravity. Inferencia epistemológica y evolución del pensamiento a través de capas biológicas, contextuales y de descarga material.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 text-white font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] select-none cursor-pointer"
        >
          <Plus size={18} />
          Ingresar Nodo Cognitivo
        </button>
      </header>

      {/* ALERTA DE EXITO */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm relative z-10"
          >
            <Check size={18} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* EL PUNCH VISUAL: EL GRAFO DE CONECTIVIDAD COGNITIVA 2D */}
      <section className="p-8 rounded-3xl bg-zinc-950/40 backdrop-blur-2xl border border-white/5 relative z-10 flex flex-col gap-6 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-purple-500/[0.01] pointer-events-none" />
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-2">
              <Cpu size={16} className="text-indigo-400 animate-pulse" />
              Lienzo Neuro-Conectivo Interactivo (Mapa de Relaciones)
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono mt-1">Eje X: Línea Temporal (1890-1930) | Eje Y: Nivel de Abstracción Estructural (1-10) | Sinapsis: Linaje evolutivo</p>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono italic">Pasa el ratón por los nodos para activar los caminos sinápticos</span>
        </div>

        {/* GRAFO SVG INTERACTIVO */}
        <div className="relative w-full h-[320px] bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
          {/* Fondo cuadriculado técnico de laboratorio */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          <svg 
            viewBox="0 0 800 300" 
            className="w-full h-full relative z-10 opacity-90 select-none"
          >
            {/* Ejes y guías */}
            <line x1="50" y1="20" x2="50" y2="260" stroke="#ffffff10" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="260" x2="780" y2="260" stroke="#ffffff10" strokeWidth="1" />
            
            {/* Etiquetas ejes */}
            <text x="40" y="30" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="end">MAX (10)</text>
            <text x="40" y="145" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="end" transform="rotate(-90 40 145)">ABSTRACCIÓN</text>
            <text x="40" y="255" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="end">MIN (1)</text>

            <text x="50" y="280" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="middle">1890</text>
            <text x="230" y="280" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="middle">1900</text>
            <text x="410" y="280" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="middle">1910</text>
            <text x="590" y="280" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="middle">1920</text>
            <text x="750" y="280" fill="#71717a" fontSize="9" fontFamily="monospace" textAnchor="middle">1930</text>
            <text x="780" y="295" fill="#71717a" fontSize="8" fontFamily="monospace" textAnchor="end">TIEMPO (AÑOS)</text>

            {/* DIBUJAR LÍNEAS SINÁPTICAS (CONEXIONES) */}
            {graphConnections.map((conn) => (
              <path
                key={conn.id}
                d={`M ${conn.fromX} ${conn.fromY} Q ${(conn.fromX + conn.toX) / 2} ${(conn.fromY + conn.toY) / 2 - 30} ${conn.toX} ${conn.toY}`}
                fill="none"
                stroke={conn.highlighted ? "#38bdf8" : "#ffffff08"}
                strokeWidth={conn.highlighted ? 2.5 : 1}
                className="transition-all duration-300"
                style={{ 
                  filter: conn.highlighted ? "drop-shadow(0 0 4px #0ea5e9)" : "none" 
                }}
              />
            ))}

            {/* DIBUJAR PARTICULAS / NODOS */}
            {nodeGraphPositions.map((node) => {
              const isHovered = hoveredNodeId === node.id;
              const isActiveInFilter = filteredNodes.some(n => n.id_nodo === node.id);

              return (
                <g 
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => handleGraphNodeClick(node.id)}
                >
                  {/* Halo de luz de hover */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 24 : 14}
                    fill={node.dmnScore > 0.5 ? "rgba(168,85,247,0.15)" : "rgba(14,165,233,0.15)"}
                    className="transition-all duration-300"
                    style={{ filter: "blur(4px)" }}
                  />
                  {/* Partícula central */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 8 : 6}
                    fill={
                      !isActiveInFilter ? "#27272a" :
                      node.dmnScore > 0.5 ? "#a855f7" : "#0ea5e9"
                    }
                    stroke={
                      !isActiveInFilter ? "#18181b" :
                      isHovered ? "#fff" : (node.dmnScore > 0.5 ? "#c084fc" : "#38bdf8")
                    }
                    strokeWidth={isHovered ? 2 : 1}
                    className="transition-all duration-300"
                    style={{
                      filter: isActiveInFilter ? `drop-shadow(0 0 8px ${node.dmnScore > 0.5 ? '#a855f7' : '#0ea5e9'})` : "none"
                    }}
                  />
                  {/* Texto de movimiento */}
                  <text
                    x={node.x}
                    y={node.y - 14}
                    textAnchor="middle"
                    fill={isHovered ? "#fff" : "#71717a"}
                    fontSize={isHovered ? 10 : 8}
                    fontWeight={isHovered ? "bold" : "normal"}
                    fontFamily="monospace"
                    className="transition-all duration-300"
                  >
                    {node.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* TARJETA FLOTANTE INFORMATIVA DE HOVER */}
          <AnimatePresence>
            {hoveredNodeId && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-4 right-4 p-4 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-2xl max-w-sm pointer-events-none font-mono text-left z-20"
              >
                {(() => {
                  const node = nodes.find(n => n.id_nodo === hoveredNodeId);
                  if (!node) return null;
                  return (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <h4 className="text-white font-bold text-sm">{node.movimiento}</h4>
                        <span className="text-[9px] text-zinc-500 uppercase">{node.capa_1_tronco_biologico.dinamica_dmn_ecn.split(".")[0]}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                        "{node.capa_3_descarga_morfologica.vectores_de_bisociacion[0] || ""}"
                      </p>
                      <div className="flex gap-2 text-[9px] text-zinc-500 border-t border-white/5 pt-1.5">
                        <span>Abstracción: <strong className="text-white">{node.capa_3_descarga_morfologica.nivel_de_abstraccion_material}/10</strong></span>
                        <span>Descarga: <strong className="text-white">{node.capa_3_descarga_morfologica.tecnologias_de_descarga[0].substring(0,20)}...</strong></span>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* COMPARADOR SIMULTÁNEO */}
      <AnimatePresence>
        {selectedNodesForComparison.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-4 p-6 rounded-3xl bg-zinc-950/80 backdrop-blur-xl border border-white/5 relative z-10 overflow-hidden shadow-inner"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-2">
                <Activity size={16} className="text-indigo-400 animate-pulse" />
                Matriz de Correlación Comparativa ({selectedNodesForComparison.length}/2)
              </h2>
              <button 
                onClick={() => setSelectedNodesForComparison([])}
                className="text-xs text-zinc-500 hover:text-white transition-colors uppercase font-mono select-none cursor-pointer"
              >
                Limpiar Comparador
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {comparisonNodes.map((node) => (
                <div key={node.id_nodo} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 relative flex flex-col gap-4">
                  <button 
                    onClick={() => toggleComparison(node.id_nodo)}
                    className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white transition-colors select-none cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <div>
                    <h3 className="text-lg font-bold text-white">{node.movimiento}</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Linajes: {node.genealogia_abductiva.map(g => g.split(":")[0]).join(", ")}</p>
                  </div>

                  {/* Perfil bioquímico comparativo de redes */}
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col gap-3 font-mono text-xs text-zinc-400">
                    <p><strong className="text-white uppercase text-[9px] block mb-1">Dínamica DMN/ECN:</strong> {node.capa_1_tronco_biologico.dinamica_dmn_ecn}</p>
                    <p><strong className="text-white uppercase text-[9px] block mb-1">Hipofrontalidad:</strong> {node.capa_1_tronco_biologico.hipofrontalidad_transitoria}</p>
                    <p><strong className="text-white uppercase text-[9px] block mb-1">Carga de Entorno:</strong> {node.capa_1_tronco_biologico.carga_noradrenergica}</p>
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-xs text-zinc-400">
                    <p><strong className="text-white">Bisociación:</strong> {node.capa_3_descarga_morfologica.vectores_de_bisociacion[0]}</p>
                    <p><strong className="text-white">Herramienta de Descarga:</strong> {node.capa_3_descarga_morfologica.tecnologias_de_descarga.join(", ")}</p>
                  </div>
                </div>
              ))}
              {selectedNodesForComparison.length === 1 && (
                <div className="flex items-center justify-center border border-dashed border-white/5 rounded-2xl p-6 bg-white/[0.005]">
                  <p className="text-zinc-600 font-mono text-xs">Selecciona otro movimiento del grafo superior o de las fichas inferiores para cruzar los datos de su cerebro colectivo.</p>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CONTROL DE FILTROS & QUERY BUILDER */}
      <section className="p-6 rounded-2xl bg-white/[0.01] backdrop-blur-md border border-white/5 flex flex-col gap-6 relative z-10 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase flex items-center gap-2">
            <Filter size={14} className="text-indigo-400" />
            Módulo de Consulta Estructurada (Query Builder)
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Filtrados {filteredNodes.length} de {nodes.length} Nodos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Búsqueda de texto */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-zinc-500 uppercase">Buscar por Palabra Clave o Técnica</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej. automatismo, collage, exilio..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Search size={14} className="absolute left-3.5 top-3.5 text-zinc-600" />
            </div>
          </div>

          {/* Dinámica Prefrontal */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-zinc-500 uppercase">Comportamiento Dinámico Cerebral</label>
            <select
              value={epistemologyFilter}
              onChange={(e) => setEpistemologyFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {uniqueEpistemologies.map(ep => (
                <option key={ep} value={ep}>
                  {ep === "todos" ? "Todos los Comportamientos" : ep}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Abstracción */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-500 uppercase">Mínimo Nivel de Abstracción</span>
              <span className="text-indigo-400">{minAbstraction} / 10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={minAbstraction}
              onChange={(e) => setMinAbstraction(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-zinc-900 rounded-lg cursor-pointer h-1"
            />
          </div>
        </div>
      </section>

      {/* GRILLA DE RESULTADOS - EL LIENZO DE NODOS EN 3 CAPAS CLÍNICAS */}
      <main className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredNodes.map((node) => {
            const isComparing = selectedNodesForComparison.includes(node.id_nodo);
            const activeTab = activeTabMap[node.id_nodo] || 'bio';

            const setTab = (tab: 'bio' | 'context' | 'morph') => {
              setActiveTabMap(prev => ({ ...prev, [node.id_nodo]: tab }));
            };

            return (
              <motion.article 
                key={node.id_nodo}
                layoutId={`node_${node.id_nodo}`}
                ref={el => { cardRefs.current[node.id_nodo] = el; }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col p-6 rounded-3xl bg-zinc-950/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500 relative group overflow-hidden shadow-2xl min-h-[480px]"
              >
                {/* Glow del fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Encabezado */}
                <div className="flex justify-between items-start mb-4 relative z-10 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                      {node.movimiento}
                    </h3>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 mt-1">
                      <Landmark size={10} />
                      {node.genealogia_abductiva[0].split(":")[0].replace(/_/g, " ").toUpperCase()}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleComparison(node.id_nodo)}
                    className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] uppercase select-none transition-all cursor-pointer ${
                      isComparing 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isComparing ? "Comparando" : "Comparar"}
                  </button>
                </div>

                {/* PESTAÑAS CLÍNICAS (MÉTODO CIENTÍFICO) */}
                <div className="flex gap-2 mb-4 p-1 rounded-xl bg-black/60 border border-white/5 relative z-10">
                  <button 
                    onClick={() => setTab('bio')}
                    className={`flex-1 text-center font-mono text-[9px] uppercase py-2 rounded-lg transition-colors select-none cursor-pointer ${activeTab === 'bio' ? 'bg-indigo-500 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    I. Biología
                  </button>
                  <button 
                    onClick={() => setTab('context')}
                    className={`flex-1 text-center font-mono text-[9px] uppercase py-2 rounded-lg transition-colors select-none cursor-pointer ${activeTab === 'context' ? 'bg-indigo-500 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    II. Contexto
                  </button>
                  <button 
                    onClick={() => setTab('morph')}
                    className={`flex-1 text-center font-mono text-[9px] uppercase py-2 rounded-lg transition-colors select-none cursor-pointer ${activeTab === 'morph' ? 'bg-indigo-500 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    III. Descarga
                  </button>
                </div>

                {/* LIENZO DE CONTENIDO DE LA PESTAÑA */}
                <div className="relative z-10 flex-grow flex flex-col justify-start">
                  <AnimatePresence mode="wait">
                    {activeTab === 'bio' && (
                      <motion.div
                        key="bio"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-4 font-mono text-xs text-zinc-400"
                      >
                        {/* Péndulo de Redes Neuronales (DMN vs ECN) */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2.5">
                          <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest">
                            <span>Balance de Redes: DMN vs ECN</span>
                            <span className="text-white">Dinámica Activa</span>
                          </div>
                          
                          {/* Balanza/Slider de balanza visual */}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-purple-400 font-bold">DMN (SUEÑO)</span>
                            <div className="flex-grow h-2 bg-zinc-900 rounded-full overflow-hidden relative flex items-center justify-center">
                              {/* Divisor central */}
                              <div className="absolute top-0 bottom-0 w-0.5 bg-zinc-700 z-10" />
                              <div 
                                style={{
                                  left: 0,
                                  width: node.capa_1_tronco_biologico.dinamica_dmn_ecn.toLowerCase().includes("desacople") ? "50%" : 
                                         node.capa_1_tronco_biologico.dinamica_dmn_ecn.toLowerCase().includes("dmn") ? "80%" : "20%"
                                }}
                                className="absolute top-0 bottom-0 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_8px_#a855f7]"
                              />
                            </div>
                            <span className="text-[10px] text-sky-400 font-bold">ECN (LÓGICA)</span>
                          </div>

                          <p className="text-[11px] leading-relaxed text-zinc-300 border-t border-white/5 pt-2.5 mt-1">
                            {node.capa_1_tronco_biologico.dinamica_dmn_ecn}
                          </p>
                        </div>

                        {/* Hipofrontalidad */}
                        <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5">
                          <strong className="text-white text-[9px] uppercase tracking-widest block mb-1 text-zinc-500">Hipofrontalidad Transitoria</strong>
                          <p className="text-zinc-300 leading-relaxed">{node.capa_1_tronco_biologico.hipofrontalidad_transitoria}</p>
                        </div>

                        {/* Carga Noradrenérgica */}
                        <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5">
                          <strong className="text-white text-[9px] uppercase tracking-widest block mb-1 text-zinc-500">Carga Noradrenérgica (Entorno)</strong>
                          <p className="text-zinc-300 leading-relaxed">{node.capa_1_tronco_biologico.carga_noradrenergica}</p>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'context' && (
                      <motion.div
                        key="context"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-4 font-mono text-xs text-zinc-400"
                      >
                        {/* Estresores del Entorno */}
                        <div className="flex flex-col gap-2">
                          <strong className="text-white text-[9px] uppercase tracking-widest block text-zinc-500">Estresores Multidimensionales</strong>
                          <ul className="flex flex-col gap-1.5 list-none">
                            {node.capa_2_matriz_contextual.estresores_multidimensionales.map((e, idx) => (
                              <li key={idx} className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl text-zinc-300 leading-relaxed">
                                ⚡ {e}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Ingesta Epistemológica */}
                        <div className="flex flex-col gap-2">
                          <strong className="text-white text-[9px] uppercase tracking-widest block text-zinc-500">Ingesta Epistemológica (Conocimiento)</strong>
                          <ul className="flex flex-col gap-1.5 list-none">
                            {node.capa_2_matriz_contextual.ingesta_epistemologica.map((e, idx) => (
                              <li key={idx} className="bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-xl text-zinc-300 leading-relaxed">
                                📖 {e}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'morph' && (
                      <motion.div
                        key="morph"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-4 font-mono text-xs text-zinc-400"
                      >
                        {/* Colisión de Bisociación */}
                        <div className="flex flex-col gap-2 bg-black/40 border border-white/5 p-3 rounded-xl">
                          <strong className="text-white text-[9px] uppercase tracking-widest block text-zinc-500">Colisión de Bisociación</strong>
                          <ul className="flex flex-col gap-1 text-[11px] leading-relaxed text-zinc-300 list-none">
                            {node.capa_3_descarga_morfologica.vectores_de_bisociacion.map((v, idx) => (
                              <li key={idx} className="bg-white/[0.01] p-2 rounded-lg border border-white/5 border-l-4 border-l-indigo-500">
                                💥 {v}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tecnologías de Descarga */}
                        <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
                          <strong className="text-white text-[9px] uppercase tracking-widest block text-zinc-500">Prótesis de Descarga Cognitiva</strong>
                          <div className="flex flex-wrap gap-1.5">
                            {node.capa_3_descarga_morfologica.tecnologias_de_descarga.map((t, idx) => (
                              <span key={idx} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-200">
                                🔧 {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Reglas de Saliencia */}
                        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                          <strong className="text-white text-[9px] uppercase tracking-widest block text-zinc-500">Reglas de Saliencia Estética</strong>
                          <ul className="flex flex-col gap-1.5 list-none text-[11px]">
                            {node.capa_3_descarga_morfologica.reglas_de_saliencia_estetica.map((r, idx) => (
                              <li key={idx} className="text-zinc-300 leading-relaxed italic">
                                "{r}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* VARIABLES SINGULARES - EL ESQUEMA FLEXIBLE Y SPARSE */}
                {node.variables_singulares && Object.keys(node.variables_singulares).length > 0 && (
                  <div className="border-t border-white/5 pt-3.5 mt-4 relative z-10 flex flex-col gap-2 font-mono text-[11px]">
                    <span className="text-zinc-500 uppercase text-[9px] tracking-widest">Cálculos Singulares Exclusivos:</span>
                    <div className="flex flex-col gap-1.5">
                      {Object.entries(node.variables_singulares).map(([key, val]) => (
                        <div key={key} className="bg-amber-500/[0.02] border border-amber-500/10 p-2 rounded-xl text-zinc-300 border-l-4 border-l-amber-500/40">
                          <strong className="text-amber-400 capitalize text-[10px] block mb-0.5">{key.replace(/_/g, " ")}:</strong>
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PIE DE TARJETA */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 relative z-10 text-[10px] font-mono text-zinc-500">
                  <span>Abstracción: <strong className="text-white">{node.capa_3_descarga_morfologica.nivel_de_abstraccion_material}/10</strong></span>
                  <span>Mecanismo: <strong className="text-white">{node.mecanismo_de_infeccion_cultural || "Salones"}</strong></span>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </main>

      {/* MODAL DEL PANEL DEL INVESTIGADOR (INGESTA CIENTÍFICA EXTENSIBLE) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl p-8 rounded-3xl bg-[#09090c] border border-white/10 shadow-2xl relative flex flex-col gap-6"
            >
              {/* Encabezado modal */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Layers className="text-indigo-400" size={24} />
                  <div>
                    <h2 className="text-xl font-bold text-white font-mono">Panel del Investigador: Ingesta Ontológica</h2>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">Ingresa los estímulos contextuales, biología y anomalías singulares del movimiento.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors select-none cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[65vh] pr-2">
                {/* ID Único */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Identificador Único (ej. VANG_CUBISMO_1907)</label>
                  <input 
                    type="text" required placeholder="VANG_..."
                    value={form.id_nodo}
                    onChange={(e) => setForm({ ...form, id_nodo: e.target.value })}
                    className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Movimiento */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Nombre del Movimiento Artístico</label>
                  <input 
                    type="text" required placeholder="Ej. Cubismo"
                    value={form.movimiento}
                    onChange={(e) => setForm({ ...form, movimiento: e.target.value })}
                    className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Genealogía */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Linaje Evolutivo / Genealogía (separados por coma)</label>
                  <input 
                    type="text" placeholder="herencia_simbolista: introspeccion, ruptura_dadaista: caos"
                    value={form.genealogia_abductiva}
                    onChange={(e) => setForm({ ...form, genealogia_abductiva: e.target.value })}
                    className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* CAPA 1: TRONCO BIOLÓGICO */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-white/[0.005] border border-white/5 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-indigo-400 font-mono uppercase tracking-widest">Capa 1: Dinámicas del Tronco Biológico</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Dinamica DMN vs ECN</label>
                      <input 
                        type="text" required placeholder="Desacoplamiento intencional..."
                        value={form.dinamica_dmn_ecn}
                        onChange={(e) => setForm({ ...form, dinamica_dmn_ecn: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Hipofrontalidad Transitoria</label>
                      <input 
                        type="text" required placeholder="Búsqueda de trance..."
                        value={form.hipofrontalidad_transitoria}
                        onChange={(e) => setForm({ ...form, hipofrontalidad_transitoria: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Carga Noradrenérgica (Adrenalina)</label>
                      <input 
                        type="text" required placeholder="Alta por guerra..."
                        value={form.carga_noradrenergica}
                        onChange={(e) => setForm({ ...form, carga_noradrenergica: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* CAPA 2: MATRIZ CONTEXTUAL */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-white/[0.005] border border-white/5 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-indigo-400 font-mono uppercase tracking-widest">Capa 2: Matriz Contextual (Estresores)</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-zinc-500 uppercase">Estresores Multidimensionales (separados por coma)</label>
                    <textarea 
                      rows={2} placeholder="Trauma residual de posguerra, asfixia burguesa..."
                      value={form.estresores_multidimensionales}
                      onChange={(e) => setForm({ ...form, estresores_multidimensionales: e.target.value })}
                      className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-zinc-500 uppercase">Ingesta Epistemológica (separados por coma)</label>
                    <input 
                      type="text" placeholder="Psicoanálisis, Teoría de la Relatividad, Rayos X"
                      value={form.ingesta_epistemologica}
                      onChange={(e) => setForm({ ...form, ingesta_epistemologica: e.target.value })}
                      className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* CAPA 3: DESCARGA MORFOLÓGICA */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-white/[0.005] border border-white/5 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-indigo-400 font-mono uppercase tracking-widest">Capa 3: Descarga Morfológica (Mecanismos Estéticos)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-zinc-500 uppercase">Prótesis de Descarga (separados por coma)</label>
                      <input 
                        type="text" placeholder="Automatismo verbal, cadáver exquisito, collage"
                        value={form.tecnologias_de_descarga}
                        onChange={(e) => setForm({ ...form, tecnologias_de_descarga: e.target.value })}
                        className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-zinc-500 uppercase">Nivel de Abstracción Material (1 al 10)</label>
                      <input 
                        type="range" min="1" max="10" step="1" value={form.nivel_de_abstraccion_material}
                        onChange={(e) => setForm({ ...form, nivel_de_abstraccion_material: Number(e.target.value) })}
                        className="accent-indigo-500 bg-zinc-900 rounded-lg cursor-pointer h-1.5 mt-3"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-zinc-500 uppercase">Reglas de Saliencia Estética (separadas por coma)</label>
                    <input 
                      type="text" placeholder="Si hay control racional se descarta, si es predecible se descarta"
                      value={form.reglas_de_saliencia_estetica}
                      onChange={(e) => setForm({ ...form, reglas_de_saliencia_estetica: e.target.value })}
                      className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-zinc-500 uppercase">Vectores de Bisociación (separados por punto y coma ';')</label>
                    <textarea 
                      rows={2} placeholder="Sintaxis hiperrealista + Escenarios imposibles (Dalí); Impulso subcortical + Abstracción (Miró)"
                      value={form.vectores_de_bisociacion}
                      onChange={(e) => setForm({ ...form, vectores_de_bisociacion: e.target.value })}
                      className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs resize-none"
                    />
                  </div>
                </div>

                {/* VARIABLES SINGULARES (EL ESQUEMA FLEXIBLE SPARSE) */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Variables Singulares / Anomalías Únicas (Formato "Llave: Valor, Llave2: Valor2")</label>
                  <input 
                    type="text" placeholder="ingesta_quimica: Uso experimental de éter, exilio_politico: Clausura por la Gestapo en 1933"
                    value={form.variables_singulares}
                    onChange={(e) => setForm({ ...form, variables_singulares: e.target.value })}
                    className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* MENSAJES DE ERROR */}
                {errorMessage && (
                  <div className="md:col-span-2 flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                    <ShieldAlert size={14} />
                    {errorMessage}
                  </div>
                )}

                {/* Botones de acción */}
                <div className="md:col-span-2 flex justify-end gap-4 border-t border-white/5 pt-4 mt-2">
                  <button 
                    type="button" onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 font-semibold transition-all select-none cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all select-none cursor-pointer"
                  >
                    Guardar Nodo Epistemológico
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
