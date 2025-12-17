'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, PLAYER_INFO } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 flex justify-center transition-all duration-300 pointer-events-none"
        >
            <nav 
                className={`pointer-events-auto relative w-full max-w-7xl rounded-full border transition-all duration-500 px-6 sm:px-8 ${
                    isScrolled 
                        ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-3' 
                        : 'bg-white/5 backdrop-blur-md border-white/5 shadow-lg py-4'
                }`}
            >
                {/* Glass sheen effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-transparent opacity-50 pointer-events-none"></div>

                <div className="flex items-center justify-between relative z-10">
                    {/* Logo/Name */}
                    <Link
                        href="/"
                        className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider group"
                    >
                        <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-benfica-red group-hover:to-benfica-gold transition-all duration-300">
                            {PLAYER_INFO.fullName}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                                        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-white/10 rounded-full -z-10 border border-white/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-glow"
                                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-benfica-red rounded-full shadow-[0_0_10px_#008751]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-4 mx-2 bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-2 flex flex-col"
                        >
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative p-4 rounded-xl font-display font-bold uppercase tracking-widest text-sm transition-all ${
                                            isActive 
                                                ? 'bg-benfica-red/20 text-white border border-benfica-red/30' 
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="flex items-center justify-between">
                                            {item.label}
                                            {isActive && <div className="w-2 h-2 bg-benfica-red rounded-full shadow-[0_0_8px_#008751]"></div>}
                                        </div>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}