'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { supabase, GalleryVideo } from '@/lib/supabase';
import { Play, Film, Video, Loader2 } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'all' | 'highlights' | 'training' | 'drills' | 'tactical' | 'goals';

export default function VideoGalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [videos, setVideos] = useState<GalleryVideo[]>([]);
    const [loading, setLoading] = useState(true);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        const fetchVideos = async () => {
            const { data } = await supabase
                .from('gallery_videos')
                .select('*')
                .order('display_order', { ascending: true });
            
            if (data) {
                setVideos(data as GalleryVideo[]);
            }
            setLoading(false);
        };

        fetchVideos();
    }, []);

    const categories = [
        { id: 'all' as Category, label: 'All Videos' },
        { id: 'highlights' as Category, label: 'Match Highlights' },
        { id: 'goals' as Category, label: 'Goals' },
        { id: 'training' as Category, label: 'Training Sessions' },
        { id: 'drills' as Category, label: 'Skills & Drills' },
        { id: 'tactical' as Category, label: 'Tactical Play' },
    ];

    const filteredVideos = selectedCategory === 'all'
        ? videos
        : videos.filter(video => video.category === selectedCategory);

    return (
        <>
            <Header />

            <main className="min-h-screen bg-black pt-32 pb-20 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-benfica-red/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-benfica-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Reveal>
                            <Breadcrumb />
                        </Reveal>
                    </div>

                    <div className="text-center mb-16 flex flex-col items-center">
                        <Reveal>
                            <div className="inline-flex items-center justify-center p-4 bg-benfica-red/10 rounded-full mb-6 text-benfica-red ring-1 ring-benfica-red/30">
                                <Video className="w-8 h-8" />
                            </div>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">
                                VIDEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-red to-orange-400">GALLERY</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                                Match highlights, training sessions, and tactical gameplay analysis
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
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    >
                        <AnimatePresence>
                            {filteredVideos.map((video, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={video.id}
                                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-benfica-gold/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    <div className="relative aspect-video bg-black overflow-hidden">
                                        {playingVideo === video.id ? (
                                            getYouTubeId(video.url) ? (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}?autoplay=1`}
                                                    title={video.title}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <video
                                                    controls
                                                    autoPlay
                                                    className="w-full h-full"
                                                    onEnded={() => setPlayingVideo(null)}
                                                >
                                                    <source src={video.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => setPlayingVideo(video.id)}
                                                className="absolute inset-0 flex items-center justify-center group/btn w-full h-full"
                                            >
                                                {/* Video Preview */}
                                                {getYouTubeId(video.url) ? (
                                                    <img 
                                                        src={`https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg`} 
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/btn:opacity-40 transition-opacity duration-500"
                                                        alt={video.title}
                                                    />
                                                ) : (
                                                    <video
                                                        src={video.url}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/btn:opacity-40 transition-opacity duration-500"
                                                        preload="metadata"
                                                        muted
                                                        playsInline
                                                    />
                                                )}
                                                
                                                {/* Play Button */}
                                                <div className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300 group-hover/btn:bg-benfica-red group-hover/btn:border-benfica-red shadow-2xl">
                                                    <Play className="w-8 h-8 text-white ml-1 fill-white" />
                                                </div>

                                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                                                    <span className="text-xs font-bold text-white uppercase tracking-widest bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                                        Play Video
                                                    </span>
                                                </div>
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-benfica-gold text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-benfica-gold/10 rounded-md border border-benfica-gold/20">
                                                {video.category}
                                            </span>
                                            <Film className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-white mb-2 line-clamp-1 group-hover:text-benfica-red transition-colors">
                                            {video.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 font-light leading-relaxed">
                                            {video.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <div className="text-center mt-16">
                        <Reveal>
                            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
                                Showing {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
                            </p>
                        </Reveal>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}