"use client";

import React, { useState } from 'react';
import { Trophy, Check, X, ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
    question: string;
    options: { option: string }[] | string[];
    correctAnswer: number;
}

interface TriviaQuizProps {
    questions: Question[];
}

export default function TriviaQuiz({ questions }: TriviaQuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    if (!questions || questions.length === 0) return null;

    const handleAnswerClick = (index: number) => {
        if (isAnswered) return;

        setSelectedOption(index);
        setIsAnswered(true);

        if (index === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowScore(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-8 mb-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-museum-gold/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-8 relative z-10">
                <Trophy className="text-museum-gold" size={28} />
                <h3 className="font-serif text-2xl text-museum-text">Trivia del Museo</h3>
            </div>

            {showScore ? (
                <div className="text-center py-8 relative z-10">
                    <div className="text-5xl font-bold text-museum-gold mb-4 animate-bounce">
                        {score} / {questions.length}
                    </div>
                    <p className="text-xl text-gray-300 mb-8">
                        {score === questions.length ? "¡Experto en Historia del Diseño! 🎓" : "¡Sigue aprendiendo! 📚"}
                    </p>
                    <button
                        onClick={resetQuiz}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-museum-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        <RotateCcw size={20} />
                        Intentar de nuevo
                    </button>
                </div>
            ) : (
                <div className="relative z-10">
                    <div className="mb-6 flex justify-between text-sm text-gray-500 font-mono">
                        <span>PREGUNTA {currentQuestion + 1}/{questions.length}</span>
                        <span>PUNTAJE: {score}</span>
                    </div>

                    <h4 className="text-xl text-white font-medium mb-6 leading-relaxed">
                        {questions[currentQuestion].question}
                    </h4>

                    <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => {
                            let buttonStyle = "border-white/10 hover:bg-white/5 hover:border-white/20";
                            let icon = null;

                            if (isAnswered) {
                                if (index === questions[currentQuestion].correctAnswer) {
                                    buttonStyle = "bg-green-500/20 border-green-500/50 text-green-200";
                                    icon = <Check size={20} />;
                                } else if (index === selectedOption) {
                                    buttonStyle = "bg-red-500/20 border-red-500/50 text-red-200";
                                    icon = <X size={20} />;
                                } else {
                                    buttonStyle = "border-white/5 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(index)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-center justify-between group ${buttonStyle}`}
                                >
                                    <span className="text-lg">
                                        {typeof option === 'string' ? option : option.option}
                                    </span>
                                    {icon}
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="mt-6 flex justify-end animate-in fade-in slide-in-from-bottom-4">
                            <button
                                onClick={handleNextQuestion}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                            >
                                {currentQuestion + 1 === questions.length ? "Ver Resultados" : "Siguiente Pregunta"}
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
