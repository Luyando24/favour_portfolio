'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { PLAYER_INFO, CHARACTER_DATA } from '@/lib/constants';
import { User, MapPin, Flag, Ruler, Weight, Footprints, GraduationCap, CheckCircle2, Trophy, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';

export default function ProfilePage() {
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

                    {/* Page Header */}
                    <div className="text-center mb-16 flex flex-col items-center">
                        <Reveal>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">
                                PLAYER <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-red to-green-400">PROFILE</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <div className="h-1 w-24 bg-benfica-gold mb-6 mx-auto rounded-full"></div>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                                Comprehensive breakdown of athletic attributes, personal details, and professional background.
                            </p>
                        </Reveal>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
                        {/* Left Column - Basic Information */}
                        <Reveal width="100%" delay={0.2}>
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl h-full hover:border-benfica-gold/30 transition-colors duration-500"
                            >
                                <div className="flex items-center mb-8">
                                    <div className="p-3 bg-benfica-red/20 rounded-xl mr-4 text-benfica-red">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-white">
                                        Basic Information
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="group border-b border-white/5 pb-4 hover:border-benfica-gold/30 transition-colors">
                                        <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 group-hover:text-benfica-gold transition-colors">Full Name</div>
                                        <div className="text-white text-2xl font-bold tracking-wide">{PLAYER_INFO.fullName}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="group border-b border-white/5 pb-4 hover:border-benfica-gold/30 transition-colors">
                                            <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 group-hover:text-benfica-gold transition-colors">Age</div>
                                            <div className="text-white text-xl font-semibold">{PLAYER_INFO.age} Years</div>
                                        </div>
                                        <div className="group border-b border-white/5 pb-4 hover:border-benfica-gold/30 transition-colors">
                                            <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 group-hover:text-benfica-gold transition-colors flex items-center gap-2">
                                                <Flag className="w-3 h-3" /> Nationality
                                            </div>
                                            <div className="text-white text-xl font-semibold">{PLAYER_INFO.nationality.join(' / ')}</div>
                                        </div>
                                    </div>

                                    <div className="group border-b border-white/5 pb-4 hover:border-benfica-gold/30 transition-colors">
                                        <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 group-hover:text-benfica-gold transition-colors flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> Current Location
                                        </div>
                                        <div className="text-white text-xl font-semibold">{PLAYER_INFO.location}</div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Primary Position</div>
                                        <div className="inline-block bg-benfica-gold text-black px-4 py-2 rounded-lg font-display font-bold text-xl shadow-lg shadow-benfica-gold/20">
                                            {PLAYER_INFO.position}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Reveal>

                        {/* Right Column - Stats & Attributes */}
                        <div className="flex flex-col gap-8">
                            <Reveal width="100%" delay={0.3}>
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl hover:border-benfica-gold/30 transition-colors duration-500"
                                >
                                    <div className="flex items-center mb-8">
                                        <div className="p-3 bg-blue-500/20 rounded-xl mr-4 text-blue-500">
                                            <Activity className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-white">
                                            Physical Attributes
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 text-center group hover:border-blue-500/50 transition-colors">
                                            <div className="mb-2 flex justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                <Ruler className="w-6 h-6" />
                                            </div>
                                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Height</div>
                                            <div className="text-white text-2xl font-bold">{displayHeight}</div>
                                        </div>

                                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 text-center group hover:border-blue-500/50 transition-colors">
                                            <div className="mb-2 flex justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                <Weight className="w-6 h-6" />
                                            </div>
                                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Weight</div>
                                            <div className="text-white text-2xl font-bold">{displayWeight}</div>
                                        </div>

                                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 text-center group hover:border-blue-500/50 transition-colors">
                                            <div className="mb-2 flex justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                <Footprints className="w-6 h-6" />
                                            </div>
                                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Foot</div>
                                            <div className="text-white text-2xl font-bold">{displayFoot}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Reveal>

                            <Reveal width="100%" delay={0.4}>
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gradient-to-r from-benfica-red to-green-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full flex items-center"
                                >
                                    <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                                        <Trophy className="w-48 h-48 text-white" />
                                    </div>
                                    <blockquote className="relative z-10 text-white text-xl sm:text-2xl font-display font-bold italic leading-relaxed">
                                        &ldquo;{displayTagline}&rdquo;
                                    </blockquote>
                                </motion.div>
                            </Reveal>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="max-w-7xl mx-auto mb-12">
                        <Reveal width="100%" delay={0.4}>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-benfica-gold to-transparent opacity-50"></div>
                                
                                <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-benfica-gold rounded-full"></span>
                                    Professional Biography
                                </h2>
                                
                                <div className="text-gray-300 text-lg leading-relaxed space-y-6 font-light">
                                    <p>
                                        <strong className="text-white font-bold">{displayName}</strong> is a{' '}
                                        <span className="text-white font-medium">{displayAge}-year-old {displayPosition}</span>{' '}
                                        hailing from {displayNationality[0]}, currently making her mark in{' '}
                                        <span className="text-white font-medium">{displayLocation}</span>.
                                    </p>
                                    <p>
                                        Known for being a motivated, physically dominant, and creative footballer, she possesses a strong commitment to achieving team objectives. 
                                        Her dedication to intensive training and performance excellence is evidenced by her impressive track record and ability to secure titles.
                                    </p>
                                    <div className="bg-black/30 border-l-4 border-benfica-red p-6 rounded-r-xl italic text-gray-200">
                                        "Demonstrated by a career-high <span className="text-benfica-gold font-bold">30 goals scored</span> in the most recent season.
                                        Possesses strong technical skills including dribbling, ball control, and passing accuracy, combined with tactical game awareness."
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Character & Academic Excellence */}
                    <div className="max-w-7xl mx-auto">
                        <Reveal width="100%" delay={0.5}>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-display font-bold text-white mb-2">
                                        Professionalism & Education
                                    </h2>
                                    <p className="text-gray-400">Academic background and work ethic indicators</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <motion.div whileHover={{ y: -5 }} className="bg-black/40 rounded-2xl p-6 text-center border border-white/5 hover:border-benfica-red/50 transition-all group">
                                        <div className="w-12 h-12 bg-benfica-red/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-benfica-red/20 transition-colors">
                                            <Activity className="w-6 h-6 text-benfica-red" />
                                        </div>
                                        <div className="text-lg font-display font-bold text-white mb-2">{CHARACTER_DATA.trainingVolume}</div>
                                        <div className="text-gray-500 text-xs uppercase tracking-wide">Training Intensity</div>
                                    </motion.div>

                                    <motion.div whileHover={{ y: -5 }} className="bg-black/40 rounded-2xl p-6 text-center border border-white/5 hover:border-benfica-gold/50 transition-all group">
                                        <div className="w-12 h-12 bg-benfica-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-benfica-gold/20 transition-colors">
                                            <GraduationCap className="w-6 h-6 text-benfica-gold" />
                                        </div>
                                        <div className="text-lg font-display font-bold text-white mb-2">{CHARACTER_DATA.gpa}</div>
                                        <div className="text-gray-500 text-xs uppercase tracking-wide">Academic Status</div>
                                    </motion.div>

                                    <motion.div whileHover={{ y: -5 }} className="bg-black/40 rounded-2xl p-6 text-center border border-white/5 hover:border-green-500/50 transition-all group">
                                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div className="text-lg font-display font-bold text-white mb-2">{CHARACTER_DATA.attendance}</div>
                                        <div className="text-gray-500 text-xs uppercase tracking-wide">Work Ethic</div>
                                    </motion.div>

                                    <motion.div whileHover={{ y: -5 }} className="bg-black/40 rounded-2xl p-6 text-center border border-white/5 hover:border-blue-500/50 transition-all group">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                                            <User className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="text-lg font-display font-bold text-white mb-2">{CHARACTER_DATA.familyEnvironment}</div>
                                        <div className="text-gray-500 text-xs uppercase tracking-wide">Environment</div>
                                    </motion.div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}