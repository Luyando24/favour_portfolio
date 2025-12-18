import React from 'react';

export default function SocialButton({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-gray-400 transition-all duration-300 hover:bg-white/10 ${color} group`}
            aria-label={label}
        >
            <span className="group-hover:scale-110 transition-transform duration-300">
                {icon}
            </span>
        </a>
    );
}
