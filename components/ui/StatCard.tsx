'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

interface StatCardProps {
    label: string;
    value: string;
    Icon?: LucideIcon;
    description?: string;
    category?: string;
}

export default function StatCard({
    label,
    value,
    Icon,
    description,
    category,
}: StatCardProps) {
    const categoryColors = {
        technical: 'from-benfica-red to-red-700',
        physical: 'from-benfica-gold to-yellow-600',
        cognitive: 'from-blue-600 to-blue-800',
    };

    const gradientClass = category
        ? categoryColors[category as keyof typeof categoryColors]
        : 'from-gray-700 to-gray-900';

    return (
        <TiltCard 
            whileHover={{ scale: 1.05, y: -5 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-6 shadow-lg transition-all duration-300 hover:shadow-2xl"
            depth={40}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90`}></div>

            <div className="relative z-10">
                {Icon && (
                    <div className="mb-3">
                        <Icon className="w-8 h-8 text-white/80" />
                    </div>
                )}

                <motion.div 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, originX: 0 }}
                    className="text-4xl font-display font-bold text-white mb-2"
                >
                    {value}
                </motion.div>

                <div className="text-white/90 font-medium text-sm uppercase tracking-wide">
                    {label}
                </div>

                {description && (
                    <div className="mt-2 text-white/70 text-xs">
                        {description}
                    </div>
                )}
            </div>

            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150 blur-xl"></div>
        </TiltCard>
    );
}
