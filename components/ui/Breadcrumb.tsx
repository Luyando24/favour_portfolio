'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
    const pathname = usePathname();

    // Auto-generate breadcrumbs from pathname if not provided
    const breadcrumbItems = items || generateBreadcrumbs(pathname);

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center space-x-2 text-sm ${className}`}
        >
            {/* Home Link */}
            <Link
                href="/"
                className="flex items-center text-gray-400 hover:text-benfica-gold transition-colors duration-200 group"
                aria-label="Home"
            >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>

            {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                    <div key={item.href} className="flex items-center space-x-2">
                        {/* Separator */}
                        <ChevronRight className="w-4 h-4 text-gray-600" />

                        {/* Breadcrumb Item */}
                        {isLast ? (
                            <span
                                className="text-benfica-gold font-semibold"
                                aria-current="page"
                            >
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-gray-400 hover:text-benfica-gold transition-colors duration-200 hover:underline"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    // Remove leading/trailing slashes and split
    const paths = pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [];

    // Build cumulative paths
    paths.forEach((path, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const label = formatLabel(path);

        breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
}

// Helper to format path segments into readable labels
function formatLabel(segment: string): string {
    // Handle special cases
    const specialCases: Record<string, string> = {
        'videos': 'Video Gallery',
        'photos': 'Photo Gallery',
        'highlights': 'Highlights',
        'profile': 'Player Profile',
        'stats': 'Statistics',
        'testimonials': 'Testimonials',
        'contact': 'Contact',
        'admin': 'Admin',
        'contacts': 'Contact Messages',
    };

    if (specialCases[segment]) {
        return specialCases[segment];
    }

    // Default: capitalize words and replace dashes/underscores with spaces
    return segment
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
