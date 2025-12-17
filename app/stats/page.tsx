'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/ui/StatCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { TECHNICAL_STATS, PHYSICAL_STATS } from '@/lib/constants';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { motion } from 'framer-motion';

export default function StatsPage() {
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
                                STATS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-gold to-yellow-200">METRICS</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <div className="h-1 w-24 bg-benfica-red mb-6 mx-auto rounded-full"></div>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                                Performance data showcasing technical excellence and physical attributes
                            </p>
                        </Reveal>
                    </div>

                    {/* Technical & Cognitive Metrics - UI Kept As Is (but added reveal animations) */}
                    <div className="mb-20">
                        <Reveal>
                            <div className="flex items-center justify-center mb-10">
                                <Zap className="w-8 h-8 text-benfica-red mr-3" />
                                <h2 className="text-4xl font-display font-bold text-white">
                                    Performance & Technical Metrics
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {TECHNICAL_STATS.map((stat, index) => (
                                <Reveal key={index} delay={0.1 * index}>
                                    <StatCard
                                        label={stat.label}
                                        value={stat.value}
                                        category={stat.category}
                                    />
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* Physical Data */}
                    <div className="mb-20">
                        <Reveal>
                            <div className="flex items-center justify-center mb-10">
                                <Activity className="w-8 h-8 text-benfica-gold mr-3" />
                                <h2 className="text-4xl font-display font-bold text-white">
                                    Physical Data
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {PHYSICAL_STATS.map((stat, index) => (
                                <Reveal key={index} delay={0.1 * index}>
                                    <StatCard
                                        label={stat.label}
                                        value={stat.value}
                                        category={stat.category}
                                    />
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* Performance Notes */}
                    <div className="max-w-4xl mx-auto">
                        <Reveal width="100%">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-benfica-red to-transparent opacity-50"></div>
                                
                                <div className="flex items-center mb-8">
                                    <div className="p-3 bg-benfica-red/20 rounded-xl mr-4 text-benfica-red">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-display font-bold text-white">
                                        Performance Analysis
                                    </h3>
                                </div>

                                <div className="space-y-6 text-gray-300 leading-relaxed font-light text-lg">
                                    <p>
                                        <span className="text-white font-bold text-xl block mb-2">Goal Scoring Prowess</span>
                                        With 80 goals scored and a career-high of 30 goals in a single season, Favour demonstrates
                                        exceptional finishing ability and consistency in front of goal.
                                    </p>

                                    <div className="w-full h-px bg-white/5"></div>

                                    <p>
                                        <span className="text-white font-bold text-xl block mb-2">High Conversion Rate</span>
                                        Scoring 80 goals from 120 total shots indicates a highly efficient conversion rate,
                                        showcasing clinical precision in the final third.
                                    </p>

                                    <div className="w-full h-px bg-white/5"></div>

                                    <p>
                                        <span className="text-white font-bold text-xl block mb-2">Playmaking Contribution</span>
                                        Beyond scoring, 35 assists and an 84.5% pass completion rate highlight her ability to
                                        create opportunities for teammates and maintain possession under pressure.
                                    </p>

                                    <div className="w-full h-px bg-white/5"></div>

                                    <p>
                                        <span className="text-white font-bold text-xl block mb-2">Physical Dominance</span>
                                        Combining agility, speed, and strength with a height of 166cm, she possesses the
                                        physical attributes required to compete at the highest level.
                                    </p>
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