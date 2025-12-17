'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkAdminPassword, setAdminSession } from '@/lib/admin-auth';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        if (checkAdminPassword(password)) {
            setAdminSession();
            router.push('/admin/dashboard');
        } else {
            setError('Invalid password');
            setPassword('');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-benfica-red rounded-full mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Login</h1>
                        <p className="text-gray-400">David Araj Portfolio</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-benfica-red focus:border-transparent"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-benfica-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-400 hover:text-benfica-gold transition-colors"
                        >
                            ← Back to website
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Demo: Default password is &ldquo;admin123&rdquo;</p>
                    <p className="mt-1">Change NEXT_PUBLIC_ADMIN_PASSWORD in .env.local</p>
                </div>
            </div>
        </div>
    );
}
