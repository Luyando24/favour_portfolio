'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TestimonialBlock from '@/components/ui/TestimonialBlock';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { TESTIMONIAL, PLAYER_INFO } from '@/lib/constants';
import { Quote, Award, Star, CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TestimonialsPage() {
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

                    {/* Page Header */}
                    <div className="text-center mb-16 flex flex-col items-center">
                        <Reveal>
                            <div className="inline-flex items-center justify-center p-4 bg-benfica-red/10 rounded-full mb-6 text-benfica-red ring-1 ring-benfica-red/30">
                                <Quote className="w-8 h-8" />
                            </div>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">
                                COACH <span className="text-transparent bg-clip-text bg-gradient-to-r from-benfica-red to-orange-400">TESTIMONIALS</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                                Professional assessments, performance feedback, and attribute recognition from coaching staff.
                            </p>
                        </Reveal>
                    </div>

                    {/* Featured Testimonial */}
                    <div className="max-w-5xl mx-auto mb-20">
                        <Reveal width="100%">
                            <div className="relative">
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="bg-black border border-benfica-gold/30 px-6 py-2 rounded-full flex items-center shadow-xl shadow-benfica-gold/10">
                                        <Award className="w-5 h-5 text-benfica-gold mr-2" />
                                        <span className="text-benfica-gold font-bold text-sm uppercase tracking-widest">
                                            Featured Evaluation
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden pt-12">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-benfica-gold to-transparent opacity-50"></div>
                                    <TestimonialBlock
                                        text={TESTIMONIAL.text}
                                        coach={TESTIMONIAL.coach}
                                        title={TESTIMONIAL.title}
                                    />
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Key Attributes Highlighted */}
                    <div className="max-w-6xl mx-auto">
                        <Reveal>
                            <div className="flex items-center justify-center mb-12">
                                <Star className="w-6 h-6 text-benfica-gold mr-3" />
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white text-center">
                                    Key Attributes Recognized
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Technical Excellence',
                                    description: 'Superior dribbling, ball control, and passing accuracy',
                                    color: 'from-benfica-red to-red-900',
                                    icon: <CheckCircle2 className="w-5 h-5 text-benfica-red" />
                                },
                                {
                                    title: 'Tactical Intelligence',
                                    description: 'Exceptional positioning and game awareness',
                                    color: 'from-benfica-gold to-yellow-800',
                                    icon: <CheckCircle2 className="w-5 h-5 text-benfica-gold" />
                                },
                                {
                                    title: 'Goal Scoring',
                                    description: 'Clinical finisher with 30 goals in recent season',
                                    color: 'from-blue-600 to-blue-900',
                                    icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                },
                                {
                                    title: 'Physical Dominance',
                                    description: 'Agility, strength, speed, and endurance',
                                    color: 'from-purple-600 to-purple-900',
                                    icon: <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                },
                                {
                                    title: 'Defensive Work',
                                    description: 'Strong 1v1 defending and pressing ability',
                                    color: 'from-green-600 to-green-900',
                                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
                                },
                                {
                                    title: 'Commitment',
                                    description: 'Motivated team player dedicated to objectives',
                                    color: 'from-orange-600 to-orange-900',
                                    icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                },
                            ].map((attribute, index) => (
                                <Reveal key={index} delay={0.1 * index}>
                                    <motion.div
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 h-full transition-all duration-300 hover:border-white/20 hover:shadow-2xl"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${attribute.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                                    {attribute.icon}
                                                </div>
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">0{index + 1}</div>
                                            </div>
                                            
                                            <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-benfica-gold transition-colors">
                                                {attribute.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                                                {attribute.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="max-w-3xl mx-auto mt-20 text-center">
                        <Reveal width="100%">
                            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden group hover:border-benfica-red/30 transition-colors duration-500">
                                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                                
                                <h3 className="text-2xl font-display font-bold text-white mb-4 relative z-10">
                                    Want to see the stats backing these claims?
                                </h3>
                                <p className="text-gray-400 text-lg mb-8 relative z-10 font-light">
                                    Explore the detailed performance metrics and match analysis.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                    <Link
                                        href="/stats"
                                        className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-benfica-red text-white rounded-xl font-display font-bold uppercase tracking-wide hover:bg-green-600 transition-all shadow-lg hover:shadow-benfica-red/25 transform hover:-translate-y-1"
                                    >
                                        <span>View Full Stats</span>
                                        <span className="ml-1">→</span>
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-display font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/20 transition-all transform hover:-translate-y-1"
                                    >
                                        <span>Contact Us</span>
                                        <span className="ml-1">→</span>
                                    </Link>
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