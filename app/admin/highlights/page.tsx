'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { Plus, Trash2, Save, RefreshCw, Trophy } from 'lucide-react';
import { supabase, CareerHighlight, getCareerHighlights } from '@/lib/supabase';

export default function AdminHighlightsPage() {
    const [highlights, setHighlights] = useState<CareerHighlight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newHighlight, setNewHighlight] = useState<Partial<CareerHighlight>>({
        title: '',
        description: '',
        year: '',
        icon: '⚽',
        display_order: 0
    });

    const fetchHighlights = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCareerHighlights();
            setHighlights(data);
        } catch (err) {
            setError('Failed to fetch highlights');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHighlights();
    }, []);

    const handleAddHighlight = async () => {
        if (!newHighlight.title || !newHighlight.year) return;

        try {
            const { error } = await supabase
                .from('career_highlights')
                .insert([newHighlight]);

            if (error) throw error;
            
            setNewHighlight({ title: '', description: '', year: '', icon: '⚽', display_order: 0 });
            fetchHighlights();
        } catch (err) {
            alert('Error adding highlight');
            console.error(err);
        }
    };

    const handleDeleteHighlight = async (id: string) => {
        if (!confirm('Delete this highlight?')) return;
        try {
            const { error } = await supabase.from('career_highlights').delete().eq('id', id);
            if (error) throw error;
            setHighlights(highlights.filter(h => h.id !== id));
        } catch (err) {
            alert('Error deleting highlight');
            console.error(err);
        }
    };

    const handleUpdateHighlight = async (id: string, updates: Partial<CareerHighlight>) => {
        try {
            const { error } = await supabase
                .from('career_highlights')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            
            setIsEditing(null);
            fetchHighlights();
        } catch (err) {
            alert('Error updating highlight');
            console.error(err);
        }
    };

    // Sub-details management (simplified for now: user can add detail rows separately or we build a nested UI)
    // For this MVP, we will stick to managing the main highlight entries.
    // Adding details would require a nested list management which is complex but doable.
    // Let's add a simple "Add Detail" feature if needed, or keep it simple.
    // Given the prompt "complete the dashboard", I'll focus on the main CRUD.
    
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Career Highlights</h1>
                                <p className="text-gray-400">Manage career milestones and achievements</p>
                            </div>
                            <button
                                onClick={fetchHighlights}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Add New Highlight */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-benfica-gold" /> Add New Highlight
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Title (e.g., ZUST FC)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newHighlight.title}
                                    onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Year (e.g., 2023-24)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newHighlight.year}
                                    onChange={(e) => setNewHighlight({ ...newHighlight, year: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Icon (Emoji or text)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newHighlight.icon}
                                    onChange={(e) => setNewHighlight({ ...newHighlight, icon: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newHighlight.description}
                                    onChange={(e) => setNewHighlight({ ...newHighlight, description: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleAddHighlight}
                                disabled={!newHighlight.title || !newHighlight.year}
                                className="bg-benfica-red text-white rounded-lg px-6 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                Add Highlight
                            </button>
                        </div>

                        {/* Highlights List */}
                        <div className="space-y-4">
                            {highlights.map((highlight) => (
                                <div key={highlight.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-benfica-gold/30 transition-all">
                                    {isEditing === highlight.id ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                    defaultValue={highlight.title}
                                                    id={`edit-title-${highlight.id}`}
                                                />
                                                <input
                                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                    defaultValue={highlight.year}
                                                    id={`edit-year-${highlight.id}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                    defaultValue={highlight.icon}
                                                    id={`edit-icon-${highlight.id}`}
                                                />
                                                <input
                                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                    defaultValue={highlight.description}
                                                    id={`edit-desc-${highlight.id}`}
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        const title = (document.getElementById(`edit-title-${highlight.id}`) as HTMLInputElement).value;
                                                        const year = (document.getElementById(`edit-year-${highlight.id}`) as HTMLInputElement).value;
                                                        const icon = (document.getElementById(`edit-icon-${highlight.id}`) as HTMLInputElement).value;
                                                        const description = (document.getElementById(`edit-desc-${highlight.id}`) as HTMLInputElement).value;
                                                        handleUpdateHighlight(highlight.id, { title, year, icon, description });
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
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="text-4xl">{highlight.icon}</div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{highlight.title}</h3>
                                                    <p className="text-benfica-gold font-semibold">{highlight.year}</p>
                                                    <p className="text-gray-400 mt-1">{highlight.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setIsEditing(highlight.id)}
                                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHighlight(highlight.id)}
                                                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {highlights.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                No highlights found. Add one above.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
