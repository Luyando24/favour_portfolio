'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { ImageIcon, Plus, Trash2, RefreshCw, Upload, X, Edit, Save } from 'lucide-react';
import { supabase, GalleryPhoto, getPhotos, deletePhoto } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminPhotosPage() {
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPhotos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPhotos();
            setPhotos(data);
        } catch (err) {
            setError('Failed to fetch photos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        setUploading(true);

        try {
            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('photos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('gallery_photos')
                .insert([{
                    url: publicUrl,
                    caption: file.name.split('.')[0], // Default caption
                    category: 'all', // Default category
                    display_order: photos.length + 1
                }]);

            if (dbError) throw dbError;

            fetchPhotos();
        } catch (err: any) {
            alert('Error uploading photo: ' + (err.message || err));
            console.error(err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeletePhoto = async (id: string, url: string) => {
        if (!confirm('Delete this photo?')) return;
        
        try {
            // 1. Delete from Storage (Extract path from URL)
            // URL format: https://.../storage/v1/object/public/photos/filename.jpg
            const path = url.split('/photos/').pop();
            if (path) {
                const { error: storageError } = await supabase.storage
                    .from('photos')
                    .remove([path]);
                
                if (storageError) console.warn('Could not delete file from storage', storageError);
            }

            // 2. Delete from DB
            await deletePhoto(id);
            setPhotos(photos.filter(p => p.id !== id));
        } catch (err) {
            alert('Error deleting photo');
            console.error(err);
        }
    };

    const handleUpdatePhoto = async (id: string, caption: string, category: string) => {
        try {
            const { error } = await supabase
                .from('gallery_photos')
                .update({ caption, category })
                .eq('id', id);

            if (error) throw error;
            
            setIsEditing(null);
            fetchPhotos();
        } catch (err) {
            alert('Error updating photo');
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
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Photo Management</h1>
                                <p className="text-gray-400">Manage photo gallery</p>
                            </div>
                            <button
                                onClick={fetchPhotos}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Upload Area */}
                        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8 text-center border-dashed border-2 border-gray-700 hover:border-benfica-red transition-colors cursor-pointer"
                             onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={uploading}
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <RefreshCw className="w-12 h-12 text-benfica-gold animate-spin mb-4" />
                                    <p className="text-white font-semibold">Uploading...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="w-12 h-12 text-gray-500 mb-4" />
                                    <p className="text-white font-semibold text-lg mb-2">Click to upload photo</p>
                                    <p className="text-gray-500 text-sm">JPG, PNG, WebP supported</p>
                                </div>
                            )}
                        </div>

                        {/* Photos Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {photos.map((photo) => (
                                <div key={photo.id} className="bg-gray-900 rounded-xl overflow-hidden group relative border border-gray-800">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={photo.url}
                                            alt={photo.caption || 'Gallery Photo'}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePhoto(photo.id, photo.url);
                                                }}
                                                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transform hover:scale-110 transition-all"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        {isEditing === photo.id ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                                    defaultValue={photo.caption}
                                                    id={`edit-caption-${photo.id}`}
                                                    placeholder="Caption"
                                                />
                                                <select
                                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                                    defaultValue={photo.category || 'all'}
                                                    id={`edit-category-${photo.id}`}
                                                >
                                                    <option value="all">All</option>
                                                    <option value="action">Action</option>
                                                    <option value="training">Training</option>
                                                    <option value="match">Match</option>
                                                    <option value="lifestyle">Lifestyle</option>
                                                    <option value="youth">Youth</option>
                                                </select>
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            const caption = (document.getElementById(`edit-caption-${photo.id}`) as HTMLInputElement).value;
                                                            const category = (document.getElementById(`edit-category-${photo.id}`) as HTMLSelectElement).value;
                                                            handleUpdatePhoto(photo.id, caption, category);
                                                        }}
                                                        className="text-green-500 hover:text-green-400 p-1"
                                                    >
                                                        <Save className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditing(null)}
                                                        className="text-gray-500 hover:text-gray-400 p-1"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 mr-2 overflow-hidden">
                                                    <p className="text-white text-sm truncate font-medium">{photo.caption}</p>
                                                    <span className="text-xs text-benfica-gold uppercase tracking-wider font-bold block mt-1">{photo.category || 'all'}</span>
                                                </div>
                                                <button
                                                    onClick={() => setIsEditing(photo.id)}
                                                    className="text-gray-500 hover:text-white"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-gray-500 text-xs mt-2 pt-2 border-t border-gray-800">
                                            Added: {new Date(photo.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {photos.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                No photos found. Upload one above.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
