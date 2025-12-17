'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { GraduationCap, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { supabase, Education, getEducation } from '@/lib/supabase';

export default function AdminEducationPage() {
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [newEducation, setNewEducation] = useState<Partial<Education>>({
        degree: '',
        institution: '',
        year: '',
        details: '',
        website: '',
        display_order: 0
    });

    const fetchEducation = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEducation();
            setEducation(data);
        } catch (err) {
            setError('Failed to fetch education');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    const handleAddEducation = async () => {
        if (!newEducation.degree || !newEducation.institution) return;

        try {
            const { error } = await supabase
                .from('education')
                .insert([newEducation]);

            if (error) throw error;
            
            setNewEducation({ degree: '', institution: '', year: '', details: '', website: '', display_order: 0 });
            fetchEducation();
        } catch (err) {
            alert('Error adding education');
            console.error(err);
        }
    };

    const handleDeleteEducation = async (id: string) => {
        if (!confirm('Delete this education entry?')) return;
        try {
            const { error } = await supabase.from('education').delete().eq('id', id);
            if (error) throw error;
            setEducation(education.filter(e => e.id !== id));
        } catch (err) {
            alert('Error deleting education');
            console.error(err);
        }
    };

    const handleUpdateEducation = async (id: string, updates: Partial<Education>) => {
        try {
            const { error } = await supabase
                .from('education')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            
            setIsEditing(null);
            fetchEducation();
        } catch (err) {
            alert('Error updating education');
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
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Education</h1>
                                <p className="text-gray-400">Manage academic qualifications</p>
                            </div>
                            <button
                                onClick={fetchEducation}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Add New Education */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-benfica-gold" /> Add New Education
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Degree (e.g., Master's Degree)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newEducation.degree}
                                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newEducation.institution}
                                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Year (e.g., 2025)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newEducation.year}
                                    onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Details (City, Level)"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newEducation.details}
                                    onChange={(e) => setNewEducation({ ...newEducation, details: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Website URL"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                    value={newEducation.website}
                                    onChange={(e) => setNewEducation({ ...newEducation, website: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleAddEducation}
                                disabled={!newEducation.degree || !newEducation.institution}
                                className="bg-benfica-red text-white rounded-lg px-6 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                Add Education
                            </button>
                        </div>

                        {/* Education List */}
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-benfica-gold/30 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-benfica-red/10 p-3 rounded-lg">
                                            <GraduationCap className="w-6 h-6 text-benfica-red" />
                                        </div>
                                        <div className="flex-1">
                                            {isEditing === edu.id ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input
                                                            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                            defaultValue={edu.degree}
                                                            id={`edit-degree-${edu.id}`}
                                                        />
                                                        <input
                                                            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                            defaultValue={edu.institution}
                                                            id={`edit-inst-${edu.id}`}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <input
                                                            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                            defaultValue={edu.year}
                                                            id={`edit-year-${edu.id}`}
                                                        />
                                                        <input
                                                            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                            defaultValue={edu.details}
                                                            id={`edit-details-${edu.id}`}
                                                        />
                                                        <input
                                                            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
                                                            defaultValue={edu.website}
                                                            id={`edit-web-${edu.id}`}
                                                        />
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                const degree = (document.getElementById(`edit-degree-${edu.id}`) as HTMLInputElement).value;
                                                                const institution = (document.getElementById(`edit-inst-${edu.id}`) as HTMLInputElement).value;
                                                                const year = (document.getElementById(`edit-year-${edu.id}`) as HTMLInputElement).value;
                                                                const details = (document.getElementById(`edit-details-${edu.id}`) as HTMLInputElement).value;
                                                                const website = (document.getElementById(`edit-web-${edu.id}`) as HTMLInputElement).value;
                                                                handleUpdateEducation(edu.id, { degree, institution, year, details, website });
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
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                                                        <p className="text-benfica-gold font-semibold uppercase tracking-wider text-sm">{edu.institution}</p>
                                                        <p className="text-gray-400 mt-1 text-sm">{edu.year} • {edu.details}</p>
                                                        {edu.website && (
                                                            <a href={edu.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-xs mt-2 inline-block">
                                                                {edu.website}
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setIsEditing(edu.id)}
                                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteEducation(edu.id)}
                                                            className="p-2 text-red-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {education.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                No education entries found. Add one above.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
