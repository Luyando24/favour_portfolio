'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { Save, RefreshCw, Loader2, Upload, Trash2 } from 'lucide-react';
import { supabase, PlayerInfo, getPlayerInfo, updatePlayerInfo } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminProfilePage() {
    const [info, setInfo] = useState<PlayerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchInfo = async () => {
        setLoading(true);
        try {
            const data = await getPlayerInfo();
            setInfo(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch player info');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!info) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Remove id and updated_at from the update object if they exist in the form data spread
            const { id, updated_at, ...updates } = info;
            
            // If ID exists, update. If not, we might need to insert (but schema implies one row usually seeded)
            // Ideally we use the ID from the fetched info.
            if (info.id) {
                await updatePlayerInfo(info.id, updates);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                // Handle case where no row exists (should not happen if seeded)
                const { error } = await supabase.from('player_info').insert([updates]);
                if (error) throw error;
                fetchInfo();
            }
        } catch (err: any) {
            console.error(err);
            setError('Failed to save changes: ' + (err.message || JSON.stringify(err)));
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!info) return;
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PlayerInfo) => {
        if (!info) return;
        const value = e.target.value;
        // Split by comma and trim
        const array = value.split(',').map(item => item.trim()).filter(Boolean);
        setInfo({ ...info, [field]: array });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !info) return;
        
        const file = e.target.files[0];
        setUploading(true);
        setError(null);

        try {
            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `hero_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('photos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(filePath);

            // 3. Update local state (will be saved to DB on form submit or immediately?)
            // Let's save immediately for better UX on file uploads usually, or just set state.
            // Setting state means user has to click save. Let's do that to be consistent with other fields.
            setInfo({ ...info, hero_image_url: publicUrl });
            
        } catch (err: any) {
            console.error(err);
            setError('Failed to upload image: ' + (err.message || err));
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex min-h-screen bg-black">
                    <AdminSidebar />
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-benfica-red animate-spin" />
                    </main>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Player Profile</h1>
                                <p className="text-gray-400">Manage personal information</p>
                            </div>
                            <button
                                onClick={fetchInfo}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-8 border border-gray-800 space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg">
                                    Changes saved successfully!
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Hero Image Section */}
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Hero Image</h3>
                                    <div className="flex items-start gap-6">
                                        <div className="relative w-48 h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                                            {info?.hero_image_url ? (
                                                <Image
                                                    src={info.hero_image_url}
                                                    alt="Hero"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-sm mb-3">
                                                Upload a new image for the hero section. Recommended size: 1920x1080.
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploading}
                                                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                                    Upload New
                                                </button>
                                                {info?.hero_image_url && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setInfo({ ...info, hero_image_url: undefined })}
                                                        className="bg-red-900/20 hover:bg-red-900/40 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Basic Info</h3>
                                    
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                                        <input
                                            name="full_name"
                                            value={info?.full_name || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Age</label>
                                        <input
                                            name="age"
                                            value={info?.age || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-1">Height</label>
                                            <input
                                                name="height"
                                                value={info?.height || ''}
                                                onChange={handleChange}
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-1">Weight</label>
                                            <input
                                                name="weight"
                                                value={info?.weight || ''}
                                                onChange={handleChange}
                                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Nationality (comma separated)</label>
                                        <input
                                            name="nationality"
                                            value={info?.nationality?.join(', ') || ''}
                                            onChange={(e) => handleArrayChange(e, 'nationality')}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Languages (comma separated)</label>
                                        <input
                                            name="languages"
                                            value={info?.languages?.join(', ') || ''}
                                            onChange={(e) => handleArrayChange(e, 'languages')}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Location</label>
                                        <input
                                            name="location"
                                            value={info?.location || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Football Info */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Football Info</h3>
                                    
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Position</label>
                                        <input
                                            name="position"
                                            value={info?.position || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Footedness</label>
                                        <input
                                            name="footedness"
                                            value={info?.footedness || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Tagline / Bio Snippet</label>
                                        <textarea
                                            name="tagline"
                                            value={info?.tagline || ''}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <h3 className="text-lg font-bold text-white">Contact & Social</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Email (separate multiple with /)</label>
                                        <input
                                            name="email"
                                            value={info?.email || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Phone</label>
                                        <input
                                            name="phone"
                                            value={info?.phone || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">WhatsApp</label>
                                        <input
                                            name="whatsapp"
                                            value={info?.whatsapp || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Instagram URL</label>
                                        <input
                                            name="instagram"
                                            value={info?.instagram || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">YouTube URL</label>
                                        <input
                                            name="youtube"
                                            value={info?.youtube || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-benfica-red focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-benfica-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
