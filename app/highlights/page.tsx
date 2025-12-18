import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { CAREER_HIGHLIGHTS } from '@/lib/constants';
import { Calendar, Award, Star } from 'lucide-react';

export default function HighlightsPage() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 animate-fade-in">
                        <Breadcrumb />
                    </div>

                    {/* Page Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white mb-6">
                            Career Highlights
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Key milestones in professional development and team success
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="max-w-5xl mx-auto space-y-12">
                        {highlights.map((highlight, index) => (
                            <div
                                key={highlight.id}
                                className="relative animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Timeline Line */}
                                {index !== highlights.length - 1 && (
                                    <div className="absolute left-8 top-20 bottom-0 w-1 bg-gradient-to-b from-benfica-red to-transparent hidden md:block"></div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                                    {/* Icon & Year */}
                                    <div className="md:col-span-3 flex md:flex-col items-center md:items-start space-x-4 md:space-x-0 md:space-y-4">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-benfica-red to-green-700 rounded-full flex items-center justify-center text-3xl shadow-lg z-10">
                                            {highlight.icon}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-5 h-5 text-benfica-gold" />
                                            <span className="text-benfica-gold font-semibold text-lg">
                                                {highlight.year}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="md:col-span-9">
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl hover:shadow-benfica-red/20 transition-all duration-300 group hover:scale-[1.02]">
                                            <h3 className="text-3xl font-display font-bold text-white mb-3 group-hover:text-benfica-red transition-colors">
                                                {highlight.title}
                                            </h3>

                                            <p className="text-gray-300 text-lg mb-6">
                                                {highlight.description}
                                            </p>

                                            <div className="space-y-3">
                                                {highlight.details.map((detail, idx) => (
                                                    <div key={idx} className="flex items-start space-x-3">
                                                        <Star className="w-5 h-5 text-benfica-gold flex-shrink-0 mt-1" />
                                                        <span className="text-gray-400">{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Achievement Stats */}
                    <div className="max-w-5xl mx-auto mt-20">
                        <div className="bg-gradient-to-r from-benfica-red to-green-700 rounded-2xl p-8 sm:p-12 text-white">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                                <div className="space-y-2">
                                    <Award className="w-12 h-12 mx-auto mb-3" />
                                    <div className="text-4xl font-display font-bold">5</div>
                                    <div className="text-white/90 uppercase tracking-wide text-sm">
                                        Golden Boots
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Star className="w-12 h-12 mx-auto mb-3" />
                                    <div className="text-4xl font-display font-bold">30</div>
                                    <div className="text-white/90 uppercase tracking-wide text-sm">
                                        Goals Last Season
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Calendar className="w-12 h-12 mx-auto mb-3" />
                                    <div className="text-4xl font-display font-bold">80</div>
                                    <div className="text-white/90 uppercase tracking-wide text-sm">
                                        Career Goals
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
