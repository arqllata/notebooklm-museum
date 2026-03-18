import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface KeyTakeawaysProps {
    points: string[];
}

export default function KeyTakeaways({ points }: KeyTakeawaysProps) {
    if (!points || points.length === 0) return null;

    return (
        <div className="bg-museum-gold/5 border border-museum-gold/20 rounded-xl p-8 mb-12 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-museum-gold/10 rounded-lg">
                    <Lightbulb className="text-museum-gold" size={24} />
                </div>
                <h3 className="font-serif text-2xl text-museum-text">Puntos Clave</h3>
            </div>

            <ul className="grid gap-4">
                {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-4 p-4 bg-black/20 rounded-lg border border-white/5 hover:border-museum-gold/20 transition-colors">
                        <CheckCircle2 className="text-museum-gold flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-300 leading-relaxed">{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
