'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { MessageSquare, Plus, Trash2, Save, RefreshCw, Quote } from 'lucide-react';
import { supabase, Testimonial, getTestimonials } from '@/lib/supabase';

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
        text: '',
        coach: '',
        title: '',
        display_order: 0
    });

    const fetchTestimonials = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (err) {
            setError('Failed to fetch testimonials');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleAddTestimonial = async () => {
        if (!newTestimonial.text || !newTestimonial.coach) return;

        try {
            const { error } = await supabase
                .from('testimonials')
                .insert([newTestimonial]);

            if (error) throw error;
            
            setNewTestimonial({ text: '', coach: '', title: '', display_order: 0 });
            fetchTestimonials();
        } catch (err) {
            alert('Error adding testimonial');
            console.error(err);
        }
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        try {
            const { error } = await supabase.from('testimonials').delete().eq('id', id);
            if (error) throw error;
            setTestimonials(testimonials.filter(t => t.id !== id));
        } catch (err) {
            alert('Error deleting testimonial');
            console.error(err);
        }
    };

    const handleUpdateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            
            setIsEditing(null);
            fetchTestimonials();
        } catch (err) {
            alert('Error updating testimonial');
            console.error(err);
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Testimonials Management</h1>
                                <p className="text-gray-400">Manage coach testimonials and evaluations</p>
                            </div>
                            <button
                                onClick={fetchTestimonials}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Add New Testimonial */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-benfica-gold" /> Add New Testimonial
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Coach Name"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newTestimonial.coach}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, coach: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Title (e.g., Head Coach)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newTestimonial.title}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                                />
                            </div>
                            <textarea
                                placeholder="Testimonial Text"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white mb-4 min-h-[100px]"
                                value={newTestimonial.text}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                            />
                            <button
                                onClick={handleAddTestimonial}
                                disabled={!newTestimonial.text || !newTestimonial.coach}
                                className="bg-benfica-red text-white rounded-lg px-6 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                Add Testimonial
                            </button>
                        </div>

                        {/* Testimonials List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative group hover:border-benfica-gold/30 transition-all">
                                    <Quote className="absolute top-6 right-6 w-8 h-8 text-benfica-gold/20" />
                                    
                                    {isEditing === testimonial.id ? (
                                        <div className="space-y-4 relative z-10">
                                            <input
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                defaultValue={testimonial.coach}
                                                id={`edit-coach-${testimonial.id}`}
                                            />
                                            <input
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                defaultValue={testimonial.title}
                                                id={`edit-title-${testimonial.id}`}
                                            />
                                            <textarea
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white min-h-[100px]"
                                                defaultValue={testimonial.text}
                                                id={`edit-text-${testimonial.id}`}
                                            />
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        const coach = (document.getElementById(`edit-coach-${testimonial.id}`) as HTMLInputElement).value;
                                                        const title = (document.getElementById(`edit-title-${testimonial.id}`) as HTMLInputElement).value;
                                                        const text = (document.getElementById(`edit-text-${testimonial.id}`) as HTMLTextAreaElement).value;
                                                        handleUpdateTestimonial(testimonial.id, { coach, title, text });
                                                    }}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(null)}
                                                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative z-10">
                                            <p className="text-white text-lg italic mb-4">"{testimonial.text}"</p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-benfica-gold font-bold">{testimonial.coach}</h4>
                                                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setIsEditing(testimonial.id)}
                                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                                                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {testimonials.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                No testimonials found. Add one above.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
