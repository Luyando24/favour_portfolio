'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { X, ChevronLeft, ChevronRight, Camera, Grid } from 'lucide-react';
import { GALLERY_PHOTOS } from '@/lib/gallery-data';
import { Reveal } from '@/components/ui/Reveal';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'all' | 'action' | 'training' | 'match' | 'lifestyle' | 'youth';

export default function PhotoGalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const categories = [
        { id: 'all' as Category, label: 'All Photos' },
        { id: 'action' as Category, label: 'Action Shots' },
        { id: 'training' as Category, label: 'Training' },
        { id: 'match' as Category, label: 'Match Photos' },
        { id: 'lifestyle' as Category, label: 'Lifestyle' },
        { id: 'youth' as Category, label: 'Early Career' },
    ];

    const filteredPhotos = selectedCategory === 'all'
        ? GALLERY_PHOTOS
        : GALLERY_PHOTOS.filter(photo => {
            if (selectedCategory === 'match' && photo.category === 'benfica') return true;
            return photo.category === selectedCategory;
        });

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const nextPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
        }
    };

    const prevPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
        }
    };

    return (
        <>
            <Header />

            <main className="min-h-screen bg-black pt-32 pb-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-benfica-red/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-benfica-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Reveal>
                            <Breadcrumb />
                        </Reveal>
                    </div>

                    <div className="text-center mb-16 flex flex-col items-center">
                        <Reveal>
                            <div className="inline-flex items-center justify-center p-4 bg-benfica-gold/10 rounded-full mb-6 text-benfica-gold ring-1 ring-benfica-gold/30">
                                <Camera className="w-8 h-8" />
                            </div>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">
                                PHOTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-gold to-yellow-200">GALLERY</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                                Capturing moments from matches, training, and life on and off the pitch
                            </p>
                        </Reveal>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <Reveal width="100%" delay={0.4}>
                            <div className="flex flex-wrap justify-center gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border ${selectedCategory === cat.id
                                            ? 'bg-benfica-red border-benfica-red text-white shadow-lg shadow-benfica-red/20'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[300px] max-w-8xl mx-auto"
                    >
                        <AnimatePresence>
                            {filteredPhotos.map((photo, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    key={photo.id}
                                    onClick={() => openLightbox(index)}
                                    className={`relative overflow-hidden rounded-2xl cursor-pointer group border border-white/5 bg-gray-900 ${
                                        index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                    }`}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                        <p className="text-benfica-gold text-xs font-bold uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            {photo.category}
                                        </p>
                                        <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {photo.title}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <div className="text-center mt-12 text-gray-500 font-mono text-sm uppercase tracking-widest">
                        Showing {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
                    </div>
                </div>
            </main>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-50 bg-black/20 rounded-full backdrop-blur-md"
                            aria-label="Close lightbox"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            onClick={prevPhoto}
                            className="absolute left-4 text-white/50 hover:text-white transition-colors p-4 z-50 bg-black/20 rounded-full backdrop-blur-md hover:bg-black/40 hidden md:block group"
                            aria-label="Previous photo"
                        >
                            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex flex-col items-center justify-center">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                key={lightboxIndex}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={filteredPhotos[lightboxIndex].url}
                                    alt={filteredPhotos[lightboxIndex].title || 'Photo'}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </motion.div>
                            
                            <div className="absolute bottom-8 left-0 right-0 text-center">
                                <h3 className="text-white text-xl font-display font-bold mb-2">
                                    {filteredPhotos[lightboxIndex].title}
                                </h3>
                                <p className="text-benfica-gold text-xs font-bold uppercase tracking-widest">
                                    {lightboxIndex + 1} / {filteredPhotos.length}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={nextPhoto}
                            className="absolute right-4 text-white/50 hover:text-white transition-colors p-4 z-50 bg-black/20 rounded-full backdrop-blur-md hover:bg-black/40 hidden md:block group"
                            aria-label="Next photo"
                        >
                            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}