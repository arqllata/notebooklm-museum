"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, HelpCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
    question: string;
    answer: string;
}

interface CuratorChatProps {
    items: FAQItem[];
    curatorName?: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function CuratorChat({ items, curatorName = "Francisco (IA)" }: CuratorChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: `¡Hola! Soy el asistente virtual del curador. Pregúntame sobre este episodio, por ejemplo: "¿Qué colores usan?" o "¿Cuál es el origen?".`,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    if (!items || items.length === 0) return null;

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // 1. Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // 2. Simulate Thinking Delay
        setTimeout(() => {
            const response = findBestAnswer(userMsg.text);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const normalizeText = (text: string) => {
        return text.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[¿?¡!,.]/g, ""); // Remove punctuation
    };

    const findBestAnswer = (query: string): string => {
        const normalizedQuery = normalizeText(query);
        const queryWords = normalizedQuery.split(' ').filter(w => w.length > 3);

        // Return first answer if user just says "hola" or "hello"
        if (normalizedQuery.includes("hola") || normalizedQuery.includes("buenos dias")) {
            return "¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte sobre el Art Deco?";
        }

        let bestMatch: FAQItem | null = null;
        let maxScore = 0;

        for (const item of items) {
            const normalizedQuestion = normalizeText(item.question);
            const questionWords = normalizedQuestion.split(' ');
            let score = 0;

            // 1. Direct phrase match (highest score)
            if (normalizedQuestion.includes(normalizedQuery)) {
                score += 20;
            }

            // 2. Keyword matching (bidirectional)
            // Does the question contain words from the user's query?
            for (const qWord of queryWords) {
                if (normalizedQuestion.includes(qWord)) {
                    score += 3;
                }
            }

            // Does the user's query contain important words from the question?
            for (const kWord of questionWords) {
                if (kWord.length > 4 && normalizedQuery.includes(kWord)) {
                    score += 1;
                }
            }

            if (score > maxScore) {
                maxScore = score;
                bestMatch = item;
            }
        }

        if (bestMatch && maxScore > 2) { // Threshold to avoid bad matches
            return bestMatch.answer;
        }

        return "🤔 Esa es una excelente pregunta, pero no tengo la respuesta en mis notas actuales. Intenta preguntar sobre 'origen', 'materiales', 'autores' o 'diferencias'. ¿O prefieres enviar un correo al curador?";
    };

    return (
        <div className="mb-12 border border-white/10 rounded-xl overflow-hidden bg-black/40 shadow-2xl flex flex-col h-[500px]">
            {/* Header */}
            <div className="bg-museum-gold/10 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-museum-gold text-black p-2 rounded-full">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="text-museum-gold font-bold text-sm uppercase tracking-wider">Chat del Curador</h3>
                        <p className="text-xs text-gray-400">En línea • {curatorName}</p>
                    </div>
                </div>
                <HelpCircle size={18} className="text-gray-500" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                            ? 'bg-museum-gold text-black rounded-tr-none'
                            : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                            }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            {/* Fallback Action for "Don't know" answers */}
                            {msg.text.includes("enviar esta pregunta") && (
                                <a
                                    href={`mailto:francisco@museo.com?subject=Pregunta Museo: ${messages[messages.length - 2]?.text}`}
                                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-museum-gold hover:text-white underline"
                                >
                                    <Mail size={12} />
                                    Enviar correo a Francisco
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white/5 text-gray-400 rounded-2xl p-3 rounded-tl-none flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe tu pregunta aquí..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-museum-gold/50 transition-colors"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-museum-gold text-black p-2 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}
