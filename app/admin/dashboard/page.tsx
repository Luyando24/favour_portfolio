'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { Users, Mail, Image as ImageIcon, Video, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState({
        photos: 0,
        videos: 0,
        contacts: 0
    });

    useEffect(() => {
        const fetchCounts = async () => {
            const { count: photoCount } = await supabase.from('gallery_photos').select('*', { count: 'exact', head: true });
            const { count: videoCount } = await supabase.from('gallery_videos').select('*', { count: 'exact', head: true });
            const { count: contactCount } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true });

            setCounts({
                photos: photoCount || 0,
                videos: videoCount || 0,
                contacts: contactCount || 0
            });
        };

        fetchCounts();
    }, []);

    const stats = [
        { label: 'Photos', value: counts.photos.toString(), icon: ImageIcon, href: '/admin/gallery/photos', color: 'bg-blue-500' },
        { label: 'Videos', value: counts.videos.toString(), icon: Video, href: '/admin/gallery/videos', color: 'bg-purple-500' },
        { label: 'Contact Submissions', value: counts.contacts.toString(), icon: Mail, href: '/admin/contacts', color: 'bg-green-500' },
        { label: 'Page Views', value: '-', icon: TrendingUp, href: '#', color: 'bg-orange-500' },
    ];

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-4xl font-display font-bold text-white mb-2">Dashboard</h1>
                            <p className="text-gray-400">Welcome to the admin panel</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <Link
                                        key={stat.label}
                                        href={stat.href}
                                        className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-benfica-red transition-all duration-200 group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-display font-bold text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-gray-400 text-sm">{stat.label}</div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h2 className="text-2xl font-display font-bold text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link
                                    href="/admin/gallery/photos"
                                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-all duration-200"
                                >
                                    <ImageIcon className="w-8 h-8 text-benfica-gold mx-auto mb-2" />
                                    <div className="text-white font-semibold">Manage Photos</div>
                                </Link>
                                <Link
                                    href="/admin/gallery/videos"
                                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-all duration-200"
                                >
                                    <Video className="w-8 h-8 text-benfica-gold mx-auto mb-2" />
                                    <div className="text-white font-semibold">Manage Videos</div>
                                </Link>
                                <Link
                                    href="/admin/contacts"
                                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-all duration-200"
                                >
                                    <Mail className="w-8 h-8 text-benfica-gold mx-auto mb-2" />
                                    <div className="text-white font-semibold">View Contacts</div>
                                </Link>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="mt-8 bg-benfica-red/10 border border-benfica-red/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-benfica-red mb-2">Admin Panel Info</h3>
                            <p className="text-gray-300 text-sm">
                                This is a demo admin panel. In production, integrate with Supabase for full database management,
                                authentication with Supabase Auth, and RLS policies for security.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
