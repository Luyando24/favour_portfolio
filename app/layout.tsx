import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { PLAYER_INFO } from "@/lib/constants";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: '--font-montserrat',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
    title: `${PLAYER_INFO.fullName} - Professional Football Portfolio`,
    description: PLAYER_INFO.tagline,
    keywords: [PLAYER_INFO.fullName, "Football", "Striker", "Forward", "ZUST FC"],
    authors: [{ name: PLAYER_INFO.fullName }],
    openGraph: {
        title: `${PLAYER_INFO.fullName} - Professional Football Player`,
        description: PLAYER_INFO.tagline,
        type: "profile",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: `${PLAYER_INFO.fullName} - Professional Football Player`,
        description: PLAYER_INFO.tagline,
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Person",
                            "name": PLAYER_INFO.fullName,
                            "jobTitle": "Professional Football Player",
                            "description": PLAYER_INFO.tagline,
                            "nationality": "Nigerian",
                            "birthPlace": "Anambra, Nigeria",
                            "sport": "Football (Soccer)",
                            "position": PLAYER_INFO.position,
                            "height": PLAYER_INFO.height,
                            "weight": PLAYER_INFO.weight,
                        })
                    }}
                />
            </head>
            <body className="antialiased">
                {children}
                <FloatingWhatsApp />
            </body>
        </html>
    );
}
