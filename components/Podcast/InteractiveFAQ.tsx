"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
    question: string;
    answer: string;
}

interface InteractiveFAQProps {
    items: FAQItem[];
}

export default function InteractiveFAQ({ items }: InteractiveFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!items || items.length === 0) return null;

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mb-12">
            <h3 className="font-serif text-2xl text-museum-text mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                Preguntas Museográficas
            </h3>

            <div className="space-y-4">
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={`border transition-colors rounded-lg overflow-hidden ${isOpen ? 'border-museum-gold/40 bg-white/5' : 'border-white/10 bg-transparent hover:border-white/20'
                                }`}
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${isOpen ? 'bg-museum-gold text-black' : 'bg-white/10 text-gray-400'}`}>
                                        <HelpCircle size={20} />
                                    </div>
                                    <span className={`text-lg font-medium ${isOpen ? 'text-museum-gold' : 'text-gray-200'}`}>
                                        {item.question}
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp className="text-museum-gold" /> : <ChevronDown className="text-gray-500" />}
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-5 pb-5 pl-[4.5rem] pt-0">
                                            <p className="text-gray-300 leading-relaxed border-l-2 border-museum-gold/30 pl-4">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
