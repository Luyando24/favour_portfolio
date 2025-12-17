'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { Award, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { supabase, Honour, getHonours } from '@/lib/supabase';

export default function AdminHonoursPage() {
    const [honours, setHonours] = useState<Honour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newHonour, setNewHonour] = useState<Partial<Honour>>({
        title: '',
        display_order: 0
    });

    const fetchHonours = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getHonours();
            setHonours(data);
        } catch (err) {
            setError('Failed to fetch honours');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHonours();
    }, []);

    const handleAddHonour = async () => {
        if (!newHonour.title) return;

        try {
            const { error } = await supabase
                .from('honours')
                .insert([newHonour]);

            if (error) throw error;
            
            setNewHonour({ title: '', display_order: 0 });
            fetchHonours();
        } catch (err) {
            alert('Error adding honour');
            console.error(err);
        }
    };

    const handleDeleteHonour = async (id: string) => {
        if (!confirm('Delete this honour?')) return;
        try {
            const { error } = await supabase.from('honours').delete().eq('id', id);
            if (error) throw error;
            setHonours(honours.filter(h => h.id !== id));
        } catch (err) {
            alert('Error deleting honour');
            console.error(err);
        }
    };

    const handleUpdateHonour = async (id: string, updates: Partial<Honour>) => {
        try {
            const { error } = await supabase
                .from('honours')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            
            setIsEditing(null);
            fetchHonours();
        } catch (err) {
            alert('Error updating honour');
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
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Honours & Awards</h1>
                                <p className="text-gray-400">Manage trophies and achievements</p>
                            </div>
                            <button
                                onClick={fetchHonours}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Add New Honour */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-benfica-gold" /> Add New Award
                            </h3>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Title (e.g., Golden Boot)"
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newHonour.title}
                                    onChange={(e) => setNewHonour({ ...newHonour, title: e.target.value })}
                                />
                                <button
                                    onClick={handleAddHonour}
                                    disabled={!newHonour.title}
                                    className="bg-benfica-red text-white rounded-lg px-6 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Honours List */}
                        <div className="space-y-4">
                            {honours.map((honour) => (
                                <div key={honour.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-benfica-gold/30 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="bg-benfica-gold/10 p-3 rounded-lg">
                                            <Award className="w-6 h-6 text-benfica-gold" />
                                        </div>
                                        {isEditing === honour.id ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                    defaultValue={honour.title}
                                                    id={`edit-title-${honour.id}`}
                                                />
                                                <button
                                                    onClick={() => {
                                                        const title = (document.getElementById(`edit-title-${honour.id}`) as HTMLInputElement).value;
                                                        handleUpdateHonour(honour.id, { title });
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
                                        ) : (
                                            <h3 className="text-xl font-bold text-white">{honour.title}</h3>
                                        )}
                                    </div>
                                    
                                    {!isEditing && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setIsEditing(honour.id)}
                                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteHonour(honour.id)}
                                                className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {honours.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                No honours found. Add one above.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
