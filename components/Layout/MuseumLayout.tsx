"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryBig, Headphones, Info } from 'lucide-react';
import styles from './MuseumLayout.module.css';

interface MuseumLayoutProps {
    children: React.ReactNode;
}

const MuseumLayout: React.FC<MuseumLayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        <LibraryBig size={28} className="text-museum-gold" />
                        Museo <span className="ml-1">Originals</span>
                    </Link>
                    <ul className={styles.navLinks}>
                        <li>
                            <Link href="/" className={styles.navLink}>Galería</Link>
                        </li>
                        <li>
                            <Link href="/about" className={styles.navLink}>Acerca de</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <AnimatePresence mode="wait">
                <motion.main
                    className={styles.main}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} NotebookLM Originals Museum. Curado por Francisco & IA.</p>
            </footer>
        </div>
    );
};

export default MuseumLayout;
