'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/ui/Hero';
import StatCard from '@/components/ui/StatCard';
import { Reveal } from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';
import { motion } from 'framer-motion';
import { PLAYER_INFO, CAREER_HIGHLIGHTS as DEFAULT_HIGHLIGHTS, TECHNICAL_STATS, EDUCATION as DEFAULT_EDUCATION, HONOURS as DEFAULT_HONOURS } from '@/lib/constants';
import { getPlayerStats, getCareerHighlights, getEducation, getHonours, getPhotos, getVideos, getPlayerInfo, PlayerStat, CareerHighlight, Education, Honour, GalleryPhoto, GalleryVideo, PlayerInfo } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Trophy, Target, Zap, GraduationCap, Award, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const [technicalStats, setTechnicalStats] = useState(TECHNICAL_STATS);
    const [careerHighlights, setCareerHighlights] = useState(DEFAULT_HIGHLIGHTS);
    const [education, setEducation] = useState(DEFAULT_EDUCATION);
    const [honours, setHonours] = useState<string[]>(DEFAULT_HONOURS);
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [videos, setVideos] = useState<GalleryVideo[]>([]);
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Player Info
                const infoData = await getPlayerInfo();
                if (infoData) setPlayerInfo(infoData);

                // Fetch Stats
                const statsData = await getPlayerStats();
                if (statsData && statsData.length > 0) {
                    setTechnicalStats(statsData.map(s => ({
                        label: s.label,
                        value: s.value,
                        category: s.category
                    })));
                }

                // Fetch Career Highlights
                const highlightsData = await getCareerHighlights();
                if (highlightsData && highlightsData.length > 0) {
                     const mappedHighlights = highlightsData.map((h: any) => ({
                        id: h.id,
                        title: h.title,
                        description: h.description,
                        details: [], // For now, or we fetch details if we added them
                        icon: h.icon || '⚽',
                        year: h.year
                    }));
                    setCareerHighlights(mappedHighlights as any);
                }

                // Fetch Education
                const educationData = await getEducation();
                if (educationData && educationData.length > 0) {
                    setEducation(educationData.map(e => ({
                        degree: e.degree,
                        institution: e.institution,
                        year: e.year,
                        details: e.details || '',
                        website: e.website || ''
                    })));
                }

                // Fetch Honours
                const honoursData = await getHonours();
                if (honoursData && honoursData.length > 0) {
                    setHonours(honoursData.map(h => h.title));
                }

                // Fetch Photos (for media section)
                const photosData = await getPhotos();
                if (photosData) setPhotos(photosData);

                // Fetch Videos (for media section)
                const videosData = await getVideos();
                if (videosData) setVideos(videosData);

            } catch (error) {
                console.error('Failed to load dynamic data, using defaults.', error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Header />

            <main className="bg-black relative">
                {/* Global Background Effects */}
                <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
                <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-benfica-red/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-benfica-gold/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

                {/* Hero Section */}
                <Hero
                    title={PLAYER_INFO.fullName}
                    subtitle={PLAYER_INFO.position}
                    tagline={PLAYER_INFO.tagline}
                    backgroundImage="/images/cover.jpeg"
                />

                {/* Quick Stats Section */}
                <section className="py-24 relative z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 flex flex-col items-center">
                            <Reveal>
                                <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4 tracking-tight">
                                    PERFORMANCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-gold to-yellow-200">METRICS</span>
                                </h2>
                            </Reveal>
                            <Reveal delay={0.2}>
                                <div className="h-1 w-24 bg-benfica-red mb-6 mx-auto rounded-full"></div>
                            </Reveal>
                            <Reveal delay={0.4}>
                                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                                    Proven track record of goal-scoring and offensive contribution in competitive leagues.
                                </p>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {technicalStats.map((stat, index) => (
                                <Reveal key={index} delay={0.1 * index}>
                                    <StatCard
                                        label={stat.label}
                                        value={stat.value}
                                        category={stat.category}
                                    />
                                </Reveal>
                            ))}
                        </div>

                        <div className="text-center mt-12 flex justify-center">
                            <Reveal delay={0.6}>
                                <MagneticButton strength={10}>
                                    <Link
                                        href="/stats"
                                        className="inline-flex items-center space-x-2 text-benfica-gold hover:text-white transition-colors font-semibold uppercase tracking-wider text-sm group px-4 py-2"
                                    >
                                        <span>View All Stats & Metrics</span>
                                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </MagneticButton>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Work Experience Section */}
                <section className="py-24 relative z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 flex flex-col items-center">
                            <Reveal>
                                <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4 tracking-tight">
                                    CAREER <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-red to-orange-400">JOURNEY</span>
                                </h2>
                            </Reveal>
                            <Reveal delay={0.4}>
                                <p className="text-gray-400 text-lg font-light">
                                    Professional milestones and team contributions across seasons.
                                </p>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {careerHighlights.map((highlight, index) => (
                                <Reveal key={highlight.id || index} delay={0.2 * index}>
                                    <TiltCard
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl h-full hover:border-benfica-gold/30 transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                            <span className="text-8xl grayscale">{highlight.icon}</span>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="inline-block px-3 py-1 bg-benfica-red/20 text-benfica-red text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                                                {highlight.year}
                                            </div>
                                            
                                            <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-benfica-gold transition-colors">
                                                {highlight.title}
                                            </h3>
                                            
                                            <p className="text-gray-400 mb-6 font-light">{highlight.description}</p>
                                            
                                            <ul className="space-y-3">
                                                {highlight.details.map((detail, idx) => (
                                                    <li key={idx} className="text-gray-300 text-sm flex items-start group-hover:text-white transition-colors">
                                                        <span className="text-benfica-gold mr-3 mt-1">●</span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </TiltCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Education Section - Redesigned as Timeline */}
                <section className="py-24 relative z-10 overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20 flex flex-col items-center">
                            <Reveal>
                                <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4 tracking-tight">
                                    EDUCATION & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">TRAINING</span>
                                </h2>
                            </Reveal>
                            <Reveal delay={0.3}>
                                <div className="w-24 h-1 bg-white/20 mx-auto rounded-full"></div>
                            </Reveal>
                        </div>

                        <div className="max-w-4xl mx-auto relative">
                            {/* Vertical Line */}
                            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent transform -translate-x-1/2 hidden md:block"></div>

                            <div className="space-y-12">
                                {education.map((edu, index) => (
                                    <Reveal key={index} delay={0.2} width="100%">
                                        <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                            {/* Date/Year Bubble */}
                                            <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-8 items-center">
                                                {index % 2 === 0 ? (
                                                     <div className="hidden md:block text-right">
                                                        <span className="text-6xl font-black text-white/5 block">{edu.year}</span>
                                                    </div>
                                                ) : (
                                                     <div className="md:w-full">
                                                        <TiltCard 
                                                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-benfica-gold/30 transition-colors duration-300 shadow-2xl relative group"
                                                            depth={20}
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="bg-benfica-red/20 p-3 rounded-xl text-benfica-red group-hover:bg-benfica-red group-hover:text-white transition-colors">
                                                                    <GraduationCap className="w-6 h-6" />
                                                                </div>
                                                                <span className="text-benfica-gold font-display font-bold text-xl">{edu.year}</span>
                                                            </div>
                                                            <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                                                            <p className="text-gray-400 font-medium text-sm mb-4 uppercase tracking-wide">{edu.institution}</p>
                                                            <p className="text-gray-500 text-sm font-light mb-4">{edu.details}</p>
                                                            <a href={edu.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-benfica-gold uppercase tracking-widest hover:text-white transition-colors">
                                                                Visit Website <ExternalLink className="w-3 h-3 ml-2" />
                                                            </a>
                                                        </TiltCard>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Center Dot */}
                                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black border-2 border-benfica-gold rounded-full z-10 hidden md:block shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>

                                            {/* Content Card */}
                                            <div className="w-full md:w-1/2 md:pl-8">
                                                {index % 2 !== 0 ? (
                                                    <div className="hidden md:block">
                                                        <span className="text-6xl font-black text-white/5 block">{edu.year}</span>
                                                    </div>
                                                ) : (
                                                    <TiltCard 
                                                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-benfica-gold/30 transition-colors duration-300 shadow-2xl relative group"
                                                        depth={20}
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="bg-benfica-red/20 p-3 rounded-xl text-benfica-red group-hover:bg-benfica-red group-hover:text-white transition-colors">
                                                                <GraduationCap className="w-6 h-6" />
                                                            </div>
                                                            <span className="text-benfica-gold font-display font-bold text-xl">{edu.year}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                                                        <p className="text-gray-400 font-medium text-sm mb-4 uppercase tracking-wide">{edu.institution}</p>
                                                        <p className="text-gray-500 text-sm font-light mb-4">{edu.details}</p>
                                                        <a href={edu.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-benfica-gold uppercase tracking-widest hover:text-white transition-colors">
                                                            Visit Website <ExternalLink className="w-3 h-3 ml-2" />
                                                        </a>
                                                    </TiltCard>
                                                )}
                                                
                                                {/* Mobile View (always card) */}
                                                <div className="md:hidden">
                                                     {/* Already rendered in the conditional blocks above? No, the logic above is complex for responsive. Let's simplify mobile. */}
                                                     {/* Actually, the structure above renders content on alternating sides for desktop. For mobile, we need to ensure content is visible. */}
                                                </div>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Honours Section */}
                <section className="py-24 relative z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 flex justify-center">
                            <Reveal>
                                <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-4 tracking-tight">
                                    HONOURS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">AWARDS</span>
                                </h2>
                            </Reveal>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {honours.map((honor, index) => (
                                <Reveal key={index} delay={0.1 * index}>
                                    <TiltCard 
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col items-center text-center transition-all duration-300 group h-full hover:bg-white/10 hover:border-benfica-gold/30"
                                        depth={20}
                                    >
                                        <div className="p-5 bg-gradient-to-br from-benfica-gold to-yellow-600 rounded-2xl mb-6 shadow-lg shadow-benfica-gold/20 group-hover:scale-110 transition-transform duration-300">
                                            <Award className="w-8 h-8 text-black" />
                                        </div>
                                        <p className="text-white font-semibold text-lg leading-relaxed">{honor}</p>
                                    </TiltCard>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Media Section - Redesigned Grid */}
                <section className="py-24 relative z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                            <div>
                                <Reveal>
                                    <h2 className="text-4xl sm:text-6xl font-display font-black text-white mb-2 tracking-tight">
                                        IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-red to-red-600">ACTION</span>
                                    </h2>
                                </Reveal>
                                <Reveal delay={0.2}>
                                    <p className="text-gray-400 text-lg font-light">
                                        Highlights from matches and training sessions
                                    </p>
                                </Reveal>
                            </div>
                            <div className="hidden md:block">
                                <Reveal delay={0.4}>
                                    <MagneticButton strength={10}>
                                        <Link href="/photos" className="text-white hover:text-benfica-gold transition-colors font-bold uppercase tracking-widest text-sm flex items-center gap-2 group px-4 py-2">
                                            View Full Gallery <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </MagneticButton>
                                </Reveal>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[500px]">
                            {/* Large Item */}
                            <div className="md:col-span-2 md:row-span-2 h-full">
                                <Reveal width="100%" delay={0.2} variant="scale">
                                    <Link href="/photos" className="group relative block h-full rounded-3xl overflow-hidden border border-white/10 hover:border-benfica-red/50 transition-colors">
                                        <img
                                            src={photos.length > 0 ? photos[0].url : "/gallery/photos/WhatsApp Image 2025-11-21 at 16.49.22_a4a3c45a.jpg"}
                                            alt={photos.length > 0 ? (photos[0].caption || "Match Action") : "Match Action"}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                        <div className="absolute bottom-8 left-8">
                                            <span className="bg-benfica-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase mb-3 inline-block tracking-widest">Featured</span>
                                            <h3 className="text-white text-3xl font-display font-bold">{photos.length > 0 ? (photos[0].caption || "Match Performance") : "Match Performance"}</h3>
                                        </div>
                                    </Link>
                                </Reveal>
                            </div>

                            {/* Medium Item 1 */}
                            <div className="md:col-span-1 md:row-span-2 h-full">
                                <Reveal width="100%" delay={0.3} variant="scale">
                                    <Link href="/photos" className="group relative block h-full rounded-3xl overflow-hidden border border-white/10 hover:border-benfica-red/50 transition-colors">
                                        <img
                                            src={photos.length > 1 ? photos[1].url : "/images/fe.jpg"}
                                            alt="In Action"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                        <div className="absolute bottom-8 left-8">
                                            <h3 className="text-white text-xl font-display font-bold">Game Time</h3>
                                        </div>
                                    </Link>
                                </Reveal>
                            </div>

                            {/* Small Item 1 */}
                            <div className="md:col-span-1 md:row-span-1 h-[200px] md:h-full">
                                <Reveal width="100%" delay={0.4} variant="scale">
                                    <Link href="/photos" className="group relative block h-full rounded-3xl overflow-hidden border border-white/10 hover:border-benfica-red/50 transition-colors">
                                        <img
                                            src={photos.length > 2 ? photos[2].url : "/gallery/photos/535709ca-08da-48a5-8de4-c503581dcbe6.JPG"}
                                            alt="Training"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                        <div className="absolute bottom-6 left-6">
                                            <h3 className="text-white text-lg font-display font-bold">Training</h3>
                                        </div>
                                    </Link>
                                </Reveal>
                            </div>
                             {/* Small Item 2 */}
                             <div className="md:col-span-1 md:row-span-1 h-full">
                                <Reveal width="100%" delay={0.5} variant="scale">
                                    <Link href="/videos" className="group relative block h-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden flex items-center justify-center border border-white/10 hover:border-benfica-gold/50 transition-colors">
                                        <div className="text-center w-full relative z-10">
                                            <div className="w-16 h-16 bg-benfica-gold rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-black shadow-lg shadow-benfica-gold/20">
                                                <Zap className="w-8 h-8" fill="currentColor" />
                                            </div>
                                            <span className="text-white font-bold uppercase tracking-wider text-sm">Watch Videos</span>
                                        </div>
                                        <div className="absolute inset-0 bg-benfica-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </Link>
                                </Reveal>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center md:hidden">
                             <Reveal>
                                <Link href="/photos" className="text-white hover:text-benfica-gold transition-colors font-bold uppercase tracking-widest text-sm inline-flex items-center gap-2">
                                        View Full Gallery <ExternalLink className="w-4 h-4" />
                                </Link>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* About Preview - Refreshed */}
                <section className="py-24 relative z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <Reveal width="100%" variant="fade">
                                <div className="bg-gradient-to-r from-gray-900 to-black rounded-[2.5rem] p-10 md:p-14 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity"></div>
                                    
                                    <div className="flex-1 text-center md:text-left relative z-10">
                                        <h3 className="text-4xl font-display font-black text-white mb-6 leading-tight">
                                            READY TO MAKE AN <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-red to-red-500">IMPACT?</span>
                                        </h3>
                                        <p className="text-gray-400 mb-8 max-w-md text-lg font-light leading-relaxed">
                                            {PLAYER_INFO.fullName} is available for trials and transfer opportunities. 
                                            Explore the full profile to see detailed statistics and video analysis.
                                        </p>
                                        <MagneticButton strength={5}>
                                            <Link
                                                href="/profile"
                                                className="inline-flex items-center space-x-3 bg-benfica-red text-white px-8 py-5 rounded-xl font-display font-bold uppercase tracking-widest hover:bg-white hover:text-benfica-red transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                            >
                                                <span>View Full Profile</span>
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                        </MagneticButton>
                                    </div>

                                    <div className="flex gap-4 md:gap-10 relative z-10 justify-center md:justify-start">
                                         <div className="text-center group/stat">
                                            <div className="text-5xl font-black text-white mb-2 group-hover/stat:text-benfica-gold transition-colors">{playerInfo?.age || PLAYER_INFO.age}</div>
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Age</div>
                                        </div>
                                        <div className="w-px h-20 bg-white/10"></div>
                                        <div className="text-center group/stat">
                                            <div className="text-5xl font-black text-white mb-2 group-hover/stat:text-benfica-gold transition-colors">10</div>
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Pos</div>
                                        </div>
                                        <div className="w-px h-20 bg-white/10"></div>
                                         <div className="text-center group/stat">
                                            <div className="text-5xl font-black text-white mb-2 group-hover/stat:text-benfica-gold transition-colors">{playerInfo?.nationality ? playerInfo.nationality[0].slice(0, 2).toUpperCase() : 'NG'}</div>
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Nat</div>
                                        </div>
                                    </div>

                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}