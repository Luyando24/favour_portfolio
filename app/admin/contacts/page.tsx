'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { Mail, Clock, User, Phone, MessageSquare, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    created_at: string;
    read: boolean;
}

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setContacts(data || []);
        } catch (err) {
            setError('Failed to fetch contacts. Make sure Supabase is configured.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteContact = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            const { error: deleteError } = await supabase
                .from('contact_submissions')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setContacts(contacts.filter(c => c.id !== id));
        } catch (err) {
            alert('Failed to delete contact');
            console.error(err);
        }
    };

    const toggleReadStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error: updateError } = await supabase
                .from('contact_submissions')
                .update({ read: !currentStatus })
                .eq('id', id);

            if (updateError) throw updateError;

            setContacts(contacts.map(c => 
                c.id === id ? { ...c, read: !currentStatus } : c
            ));
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Contact Submissions</h1>
                                <p className="text-gray-400">View and manage contact form submissions</p>
                            </div>
                            <button
                                onClick={fetchContacts}
                                disabled={loading}
                                className="flex items-center space-x-2 bg-benfica-red hover:bg-red-700 text-white px-4 py-2 rounded-lg
transition-all duration-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                                <p className="text-red-500">{error}</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Configure Supabase connection in .env.local and create the contact_submissions table
                                </p>
                            </div>
                        )}

                        {loading && !error ? (
                            <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                                <RefreshCw className="w-8 h-8 text-benfica-gold animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">Loading contacts...</p>
                            </div>
                        ) : contacts.length === 0 ? (
                            <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                                <Mail className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No contact submissions yet</h3>
                                <p className="text-gray-400">Contact form submissions will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className={`bg-gray-900 rounded-xl p-6 border transition-all duration-200 ${contact.read ? 'border-gray-800 opacity-75' : 'border-benfica-red/50 shadow-lg shadow-benfica-red/5'}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <User className={`w-5 h-5 ${contact.read ? 'text-gray-500' : 'text-benfica-gold'}`} />
                                                    <h3 className={`text-lg font-semibold ${contact.read ? 'text-gray-400' : 'text-white'}`}>{contact.name}</h3>
                                                    {!contact.read && (
                                                        <span className="bg-benfica-red text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="w-4 h-4" />
                                                        <a href={`mailto:${contact.email}`} className="hover:text-benfica-gold">
                                                            {contact.email}
                                                        </a>
                                                    </div>
                                                    {contact.phone && (
                                                        <div className="flex items-center space-x-2">
                                                            <Phone className="w-4 h-4" />
                                                            <span>{contact.phone}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{new Date(contact.created_at).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => toggleReadStatus(contact.id, contact.read)}
                                                    className={`p-2 transition-colors rounded-lg ${contact.read ? 'text-green-500 bg-green-500/10' : 'text-gray-400 hover:text-green-500 hover:bg-gray-800'}`}
                                                    title={contact.read ? "Mark as unread" : "Mark as read"}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteContact(contact.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-800 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>Message:</span>
                                            </div>
                                            <p className="text-white whitespace-pre-wrap">{contact.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 text-center text-sm text-gray-500">
                            Total submissions: {contacts.length}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
