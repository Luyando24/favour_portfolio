'use client';

import Image from 'next/image';
import CTAButton from './CTAButton';
import MagneticButton from './MagneticButton';
import { Download, Play, Mail } from 'lucide-react';
import { PLAYER_INFO } from '@/lib/constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface HeroProps {
    title: string;
    subtitle: string;
    tagline: string;
    backgroundImage?: string;
}

export default function Hero({
    title,
    subtitle,
    tagline,
    backgroundImage = '/images/cover.jpeg',
}: HeroProps) {
    const handleDownloadPDF = () => {
        window.open('/api/download-pdf', '_blank');
    };

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Split title for styling
    const nameParts = title.split(' ');
    const firstName = nameParts[0];
    const middleName = nameParts.length > 2 ? nameParts[1] : '';
    const lastName = nameParts[nameParts.length - 1];

    return (
        <section ref={ref} className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
            {/* Background Image - Full View */}
            <div 
                className="absolute inset-0 z-0 bg-black"
            >
                <Image
                    src={backgroundImage}
                    alt={PLAYER_INFO.fullName}
                    fill
                    className="object-contain object-center"
                    priority
                    quality={90}
                />
                {/* Modern Gradient Overlay - Lighter for visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-hero-gradient opacity-20 z-10"></div>
                
                {/* Side Fade Gradients for Letterboxing */}
                <div className="absolute inset-y-0 left-0 w-64 md:w-[50vw] bg-gradient-to-r from-black from-20% via-black/80 via-60% to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-64 md:w-[50vw] bg-gradient-to-l from-black from-20% via-black/80 via-60% to-transparent z-10"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10 pointer-events-none"></div>
            </div>

            {/* Content */}
            <motion.div 
                style={{ y: textY }}
                className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center"
            >
                <div className="max-w-4xl space-y-8 text-center md:text-left pt-24 md:pt-0">
                    {/* Subtitle / Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:border-benfica-gold/50 transition-colors duration-300"
                    >
                        <span className="w-2 h-2 rounded-full bg-benfica-red animate-pulse"></span>
                        <span className="text-benfica-gold uppercase tracking-widest text-xs sm:text-sm font-bold">
                            {subtitle}
                        </span>
                    </motion.div>

                    {/* Main Title - Dynamic Typography */}
                    <h1 className="font-display font-black text-white leading-[0.9] tracking-tight flex flex-col">
                        <motion.span 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                        >
                            {firstName}
                        </motion.span>
                        {middleName && (
                            <motion.span 
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-outline opacity-80"
                            >
                                {middleName}
                            </motion.span>
                        )}
                        <motion.span 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
                        >
                            {lastName}
                        </motion.span>
                    </h1>

                    {/* Tagline */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg sm:text-xl text-gray-300 font-light max-w-2xl leading-relaxed md:mx-0 mx-auto border-l-2 border-benfica-red pl-6"
                    >
                        {tagline}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 pt-8 justify-center md:justify-start"
                    >
                        <MagneticButton strength={5}>
                            <CTAButton
                                onClick={handleDownloadPDF}
                                variant="primary"
                                Icon={Download}
                            >
                                Download Profile
                            </CTAButton>
                        </MagneticButton>

                        <MagneticButton strength={5}>
                            <CTAButton
                                href="/videos"
                                variant="secondary"
                                Icon={Play}
                            >
                                Watch Highlights
                            </CTAButton>
                        </MagneticButton>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 right-10 z-20 hidden md:flex flex-col items-center gap-4"
            >
                <span className="text-white/40 text-xs uppercase tracking-[0.3em] rotate-90 origin-bottom translate-y-8">Scroll</span>
                <motion.div 
                    animate={{ height: [0, 96, 0], y: [0, 0, 96] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-px bg-gradient-to-b from-transparent via-white/50 to-transparent"
                />
            </motion.div>
        </section>
    );
}
