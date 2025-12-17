'use client';
'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { PLAYER_INFO } from '@/lib/constants';

export default function FloatingWhatsApp() {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        window.open(`https://wa.me/${PLAYER_INFO.whatsapp}`, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:shadow-green-500/50 hover:scale-105"
                aria-label="Contact via WhatsApp"
            >
                {/* Text - Always visible on desktop (md+), shows on hover on mobile */}
                <div
                    className={`overflow-hidden transition-all duration-300 pr-4 pl-5 md:max-w-xs md:opacity-100 ${isHovered ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 pr-0 pl-0 md:pr-4 md:pl-5'
                        }`}
                >
                    <span className="whitespace-nowrap font-semibold text-sm">
                        Chat on WhatsApp
                    </span>
                </div>

                {/* Icon container */}
                <div className="w-14 h-14 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7" />
                </div>

                {/* Pulse animation ring */}
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>
            </button>

            {/* Tooltip for mobile (appears above button) */}
            <div
                className={`md:hidden absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
            >
                Chat on WhatsApp
                <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
}
