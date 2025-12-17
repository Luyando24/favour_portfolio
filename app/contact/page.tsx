import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/ui/ContactForm';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { PLAYER_INFO } from '@/lib/constants';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Youtube } from 'lucide-react';

export default function ContactPage() {
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
                            Get In Touch
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Interested in trials, scouting opportunities, or general inquiries? Reach out today.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                        {/* Contact Form */}
                        <div className="animate-slide-up">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                                <h2 className="text-2xl font-display font-bold text-white mb-6">
                                    Send a Message
                                </h2>
                                <ContactForm />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6 animate-slide-up">
                            {/* Direct Contact */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                                <h2 className="text-2xl font-display font-bold text-white mb-6">
                                    Direct Contact
                                </h2>

                                <div className="space-y-6">
                                    {/* Email */}
                                    <a
                                        href={`mailto:${PLAYER_INFO.email}`}
                                        className="flex items-start space-x-4 text-gray-300 hover:text-benfica-red transition-colors group"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 bg-benfica-red/10 rounded-lg flex items-center justify-center group-hover:bg-benfica-red/20 transition-colors">
                                            <Mail className="w-6 h-6 text-benfica-red" />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold mb-1">Email</div>
                                            <div className="text-sm">{PLAYER_INFO.email}</div>
                                        </div>
                                    </a>

                                    {/* Phone */}
                                    <a
                                        href={`tel:${PLAYER_INFO.phone}`}
                                        className="flex items-start space-x-4 text-gray-300 hover:text-benfica-red transition-colors group"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 bg-benfica-red/10 rounded-lg flex items-center justify-center group-hover:bg-benfica-red/20 transition-colors">
                                            <Phone className="w-6 h-6 text-benfica-red" />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold mb-1">Phone</div>
                                            <div className="text-sm">{PLAYER_INFO.phone}</div>
                                        </div>
                                    </a>

                                    {/* Location */}
                                    <div className="flex items-start space-x-4 text-gray-300">
                                        <div className="flex-shrink-0 w-12 h-12 bg-benfica-red/10 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-benfica-red" />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold mb-1">Location</div>
                                            <div className="text-sm">{PLAYER_INFO.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Quick Contact */}
                            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 shadow-2xl">
                                <div className="flex items-center space-x-3 mb-4">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                    <h3 className="text-2xl font-display font-bold text-white">
                                        WhatsApp
                                    </h3>
                                </div>
                                <p className="text-white/90 mb-6">
                                    For urgent inquiries or quick questions, reach out via WhatsApp.
                                </p>
                                <a
                                    href={`https://wa.me/${PLAYER_INFO.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Start WhatsApp Chat</span>
                                </a>
                            </div>

                            {/* Social Media */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                                <h3 className="text-2xl font-display font-bold text-white mb-6">
                                    Follow on Social Media
                                </h3>

                                <div className="flex space-x-4">
                                    <a
                                        href={PLAYER_INFO.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white hover:scale-105 transition-transform"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="w-8 h-8 mx-auto mb-2" />
                                        <div className="text-center text-sm font-semibold">Instagram</div>
                                    </a>

                                    <a
                                        href={PLAYER_INFO.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-white hover:scale-105 transition-transform"
                                        aria-label="YouTube"
                                    >
                                        <Youtube className="w-8 h-8 mx-auto mb-2" />
                                        <div className="text-center text-sm font-semibold">YouTube</div>
                                    </a>
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
