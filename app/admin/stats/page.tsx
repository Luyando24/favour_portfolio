'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { BarChart3, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { supabase, PlayerStat, getPlayerStats } from '@/lib/supabase';

export default function AdminStatsPage() {
    const [stats, setStats] = useState<PlayerStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newStat, setNewStat] = useState<Partial<PlayerStat>>({
        label: '',
        value: '',
        category: 'performance',
        display_order: 0
    });

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPlayerStats();
            setStats(data);
        } catch (err) {
            setError('Failed to fetch stats');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAddStat = async () => {
        if (!newStat.label || !newStat.value) return;

        try {
            const { error } = await supabase
                .from('player_stats')
                .insert([newStat]);

            if (error) throw error;
            
            setNewStat({ label: '', value: '', category: 'performance', display_order: 0 });
            fetchStats();
        } catch (err) {
            alert('Error adding stat');
            console.error(err);
        }
    };

    const handleDeleteStat = async (id: string) => {
        if (!confirm('Delete this stat?')) return;
        try {
            const { error } = await supabase.from('player_stats').delete().eq('id', id);
            if (error) throw error;
            setStats(stats.filter(s => s.id !== id));
        } catch (err) {
            alert('Error deleting stat');
            console.error(err);
        }
    };

    const handleUpdateStat = async (id: string, updates: Partial<PlayerStat>) => {
        try {
            const { error } = await supabase
                .from('player_stats')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            
            setIsEditing(null);
            fetchStats();
        } catch (err) {
            alert('Error updating stat');
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
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Stats Management</h1>
                                <p className="text-gray-400">Manage player statistics and metrics</p>
                            </div>
                            <button
                                onClick={fetchStats}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Add New Stat */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-benfica-gold" /> Add New Stat
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Label (e.g., Goals)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newStat.label}
                                    onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Value (e.g., 30)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newStat.value}
                                    onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                                />
                                <select
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newStat.category}
                                    onChange={(e) => setNewStat({ ...newStat, category: e.target.value as any })}
                                >
                                    <option value="performance">Performance</option>
                                    <option value="technical">Technical</option>
                                    <option value="physical">Physical</option>
                                </select>
                                <button
                                    onClick={handleAddStat}
                                    disabled={!newStat.label || !newStat.value}
                                    className="bg-benfica-red text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    Add Stat
                                </button>
                            </div>
                        </div>

                        {/* Stats List */}
                        <div className="space-y-4">
                            {stats.map((stat) => (
                                <div key={stat.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex items-center justify-between group hover:border-benfica-gold/30 transition-all">
                                    {isEditing === stat.id ? (
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 mr-4">
                                            <input
                                                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                defaultValue={stat.label}
                                                id={`edit-label-${stat.id}`}
                                            />
                                            <input
                                                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                defaultValue={stat.value}
                                                id={`edit-value-${stat.id}`}
                                            />
                                            <select
                                                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                defaultValue={stat.category}
                                                id={`edit-category-${stat.id}`}
                                            >
                                                <option value="performance">Performance</option>
                                                <option value="technical">Technical</option>
                                                <option value="physical">Physical</option>
                                            </select>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        const label = (document.getElementById(`edit-label-${stat.id}`) as HTMLInputElement).value;
                                                        const value = (document.getElementById(`edit-value-${stat.id}`) as HTMLInputElement).value;
                                                        const category = (document.getElementById(`edit-category-${stat.id}`) as HTMLSelectElement).value;
                                                        handleUpdateStat(stat.id, { label, value, category: category as any });
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
                                        <>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                <div>
                                                    <span className="text-gray-400 text-xs uppercase tracking-wider block">Label</span>
                                                    <span className="text-white font-semibold">{stat.label}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-xs uppercase tracking-wider block">Value</span>
                                                    <span className="text-benfica-gold font-bold text-xl">{stat.value}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-xs uppercase tracking-wider block">Category</span>
                                                    <span className={`inline-block px-2 py-1 rounded text-xs uppercase font-bold ${
                                                        stat.category === 'performance' ? 'bg-blue-500/20 text-blue-400' :
                                                        stat.category === 'technical' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-orange-500/20 text-orange-400'
                                                    }`}>
                                                        {stat.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setIsEditing(stat.id)}
                                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStat(stat.id)}
                                                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            
                            {stats.length === 0 && !loading && (
                                <div className="text-center py-12 text-gray-500">
                                    No stats found. Add one above or run the SQL schema to seed data.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
