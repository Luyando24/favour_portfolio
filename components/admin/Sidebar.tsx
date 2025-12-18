'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Image as ImageIcon,
    Video,
    Mail,
    BarChart3,
    MessageSquare,
    Trophy,
    GraduationCap,
    Star,
    LogOut,
    User
} from 'lucide-react';
import { clearAdminSession } from '@/lib/admin-auth';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const navGroups = [
        {
            title: 'Overview',
            items: [
                { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            ]
        },
        {
            title: 'Profile Data',
            items: [
                { href: '/admin/profile', label: 'Basic Info', icon: User },
                { href: '/admin/stats', label: 'Stats', icon: BarChart3 },
                { href: '/admin/highlights', label: 'Highlights', icon: Star },
                { href: '/admin/education', label: 'Education', icon: GraduationCap },
                { href: '/admin/honours', label: 'Honours', icon: Trophy },
                { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
            ]
        },
        {
            title: 'Gallery',
            items: [
                { href: '/admin/gallery/photos', label: 'Photos', icon: ImageIcon },
                { href: '/admin/gallery/videos', label: 'Videos', icon: Video },
            ]
        },
        {
            title: 'System',
            items: [
                { href: '/admin/contacts', label: 'Contacts', icon: Mail },
                { href: '/admin/admins', label: 'Admin Users', icon: User },
            ]
        }
    ];

    const handleLogout = () => {
        clearAdminSession();
        router.push('/admin/login');
    };

    return (
        <aside className="w-64 bg-gray-900 min-h-screen p-6 flex flex-col overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-display font-bold text-benfica-gold">Admin Panel</h1>
                <p className="text-gray-400 text-sm mt-1">Favour Anekwe Portfolio</p>
            </div>

            <nav className="flex-1">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6 last:mb-0">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                            {group.title}
                        </h3>
                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${isActive
                                                    ? 'bg-benfica-red text-white shadow-lg'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 w-full"
            >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
            </button>
        </aside>
    );
}
