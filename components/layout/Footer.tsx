'use client';

import Link from 'next/link';
import { Instagram, Youtube, MessageCircle, Mail, MapPin } from 'lucide-react';
import { PLAYER_INFO, NAV_ITEMS } from '@/lib/constants';
import { getPlayerInfo, PlayerInfo } from '@/lib/supabase';
import SocialButton from '@/components/ui/SocialButton';
import { useEffect, useState } from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [dbPlayerInfo, setDbPlayerInfo] = useState<PlayerInfo | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const info = await getPlayerInfo();
                setDbPlayerInfo(info);
            } catch (error) {
                console.warn('Failed to fetch player info for footer:', error);
            }
        };
        fetchInfo();
    }, []);
    
    const displayInfo = {
        fullName: dbPlayerInfo?.full_name || PLAYER_INFO.fullName,
        tagline: dbPlayerInfo?.tagline || PLAYER_INFO.tagline,
        location: dbPlayerInfo?.location || PLAYER_INFO.location,
        email: dbPlayerInfo?.email || PLAYER_INFO.email,
        phone: dbPlayerInfo?.phone || PLAYER_INFO.phone,
        whatsapp: dbPlayerInfo?.whatsapp || PLAYER_INFO.whatsapp,
        instagram: dbPlayerInfo?.instagram || PLAYER_INFO.instagram,
        youtube: dbPlayerInfo?.youtube || PLAYER_INFO.youtube,
    };

    return (
        <footer className="relative bg-black text-white pt-20 pb-10 border-t border-white/10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-benfica-red/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-benfica-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-6">
                        <Link href="/" className="inline-block">
                            <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">
                                {displayInfo.fullName}
                            </h3>
                        </Link>
                        <p className="text-gray-400 text-lg font-light max-w-md leading-relaxed">
                            {displayInfo.tagline}
                        </p>
                        <div className="flex items-center space-x-2 text-gray-500 text-sm uppercase tracking-wider">
                            <MapPin className="w-4 h-4" />
                            <span>{displayInfo.location}</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-benfica-gold pl-3">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {NAV_ITEMS.slice(0, 5).map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-benfica-gold transition-colors duration-300 hover:pl-2 block"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="md:col-span-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-l-2 border-benfica-red pl-3">
                            Get in Touch
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-400 group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-colors">
                                <div className="p-2 bg-black rounded-lg text-benfica-red group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    {displayInfo.email.split('/').map((email, index) => (
                                        <a 
                                            key={index}
                                            href={`mailto:${email.trim()}`}
                                            className="text-sm hover:text-benfica-gold transition-colors"
                                        >
                                            {email.trim()}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <SocialButton 
                                    href={displayInfo.instagram} 
                                    icon={<Instagram className="w-5 h-5" />} 
                                    label="Instagram"
                                    color="hover:text-pink-500 hover:border-pink-500/50"
                                />
                                {displayInfo.youtube && (
                                    <SocialButton 
                                        href={displayInfo.youtube} 
                                        icon={<Youtube className="w-5 h-5" />} 
                                        label="YouTube"
                                        color="hover:text-red-500 hover:border-red-500/50"
                                    />
                                )}
                                <SocialButton 
                                    href={`https://wa.me/${displayInfo.whatsapp.replace(/\D/g, '')}`} 
                                    icon={<MessageCircle className="w-5 h-5" />} 
                                    label="WhatsApp"
                                    color="hover:text-green-500 hover:border-green-500/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-wider">
                    <p>
                        © {currentYear} {PLAYER_INFO.fullName}. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

