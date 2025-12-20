'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { Video, Plus, Trash2, RefreshCw, Upload, PlayCircle, Edit, Save, X } from 'lucide-react';
import { supabase, GalleryVideo, getVideos, deleteVideo } from '@/lib/supabase';

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<GalleryVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [uploadCategory, setUploadCategory] = useState('all');
    const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [youtubeTitle, setYoutubeTitle] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = [
        { id: 'all', label: 'All Categories' },
        { id: 'highlights', label: 'Highlights' },
        { id: 'goals', label: 'Goals' },
        { id: 'training', label: 'Training' },
        { id: 'drills', label: 'Drills' },
        { id: 'tactical', label: 'Tactical' },
    ];

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const fetchVideos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVideos();
            setVideos(data);
        } catch (err) {
            setError('Failed to fetch videos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleYouTubeSubmit = async () => {
        if (!youtubeUrl) return;
        const videoId = getYouTubeId(youtubeUrl);
        if (!videoId) {
            alert('Invalid YouTube URL');
            return;
        }

        setUploading(true);
        try {
            const { error: dbError } = await supabase
                .from('gallery_videos')
                .insert([{
                    url: youtubeUrl,
                    title: youtubeTitle || 'YouTube Video',
                    category: uploadCategory,
                    display_order: videos.length + 1
                }]);

            if (dbError) throw dbError;

            setYoutubeUrl('');
            setYoutubeTitle('');
            fetchVideos();
        } catch (err: any) {
            alert('Error adding YouTube video: ' + (err.message || err));
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

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
                .from('videos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('gallery_videos')
                .insert([{
                    url: publicUrl,
                    title: file.name.split('.')[0],
                    category: uploadCategory,
                    display_order: videos.length + 1
                }]);

            if (dbError) throw dbError;

            fetchVideos();
        } catch (err: any) {
            alert('Error uploading video: ' + (err.message || err));
            console.error(err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteVideo = async (id: string, url: string) => {
        if (!confirm('Delete this video?')) return;
        
        try {
            // 1. Delete from Storage (only if not YouTube)
            const isYouTube = getYouTubeId(url);
            if (!isYouTube) {
                const path = url.split('/videos/').pop();
                if (path) {
                    const { error: storageError } = await supabase.storage
                        .from('videos')
                        .remove([path]);
                    
                    if (storageError) console.warn('Could not delete file from storage', storageError);
                }
            }

            // 2. Delete from DB
            await deleteVideo(id);
            setVideos(videos.filter(v => v.id !== id));
        } catch (err) {
            alert('Error deleting video');
            console.error(err);
        }
    };

    const handleUpdateVideo = async (id: string, title: string, category: string) => {
        try {
            const { error } = await supabase
                .from('gallery_videos')
                .update({ title, category })
                .eq('id', id);

            if (error) throw error;
            
            setIsEditing(null);
            fetchVideos();
        } catch (err) {
            alert('Error updating video');
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
                                <h1 className="text-4xl font-display font-bold text-white mb-2">Video Management</h1>
                                <p className="text-gray-400">Manage video gallery</p>
                            </div>
                            <button
                                onClick={fetchVideos}
                                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-white transition-colors"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Upload Area */}
                        <div className="mb-6 space-y-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setUploadType('file')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        uploadType === 'file' 
                                            ? 'bg-benfica-red text-white' 
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    File Upload
                                </button>
                                <button
                                    onClick={() => setUploadType('youtube')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        uploadType === 'youtube' 
                                            ? 'bg-benfica-red text-white' 
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    YouTube URL
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="w-full sm:w-64">
                                    <label className="block text-gray-400 text-sm mb-2">Category</label>
                                    <select
                                        value={uploadCategory}
                                        onChange={(e) => setUploadCategory(e.target.value)}
                                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-benfica-red w-full"
                                    >
                                        {categories.filter(c => c.id !== 'all').map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {uploadType === 'youtube' && (
                                    <>
                                        <div className="flex-1">
                                            <label className="block text-gray-400 text-sm mb-2">Video Title</label>
                                            <input
                                                type="text"
                                                value={youtubeTitle}
                                                onChange={(e) => setYoutubeTitle(e.target.value)}
                                                placeholder="Enter video title"
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-benfica-red"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-gray-400 text-sm mb-2">YouTube URL</label>
                                            <input
                                                type="text"
                                                value={youtubeUrl}
                                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-benfica-red"
                                            />
                                        </div>
                                        <button
                                            onClick={handleYouTubeSubmit}
                                            disabled={uploading || !youtubeUrl}
                                            className="px-6 py-2 bg-benfica-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                                        >
                                            {uploading ? 'Adding...' : 'Add Video'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {uploadType === 'file' && (
                            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8 text-center border-dashed border-2 border-gray-700 hover:border-benfica-red transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="video/*"
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
                                        <p className="text-white font-semibold text-lg mb-2">Click to upload video</p>
                                        <p className="text-gray-500 text-sm">MP4, WebM supported</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Videos Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {videos.map((video) => (
                                <div key={video.id} className="bg-gray-900 rounded-xl overflow-hidden group relative border border-gray-800">
                                    <div className="aspect-video relative bg-black flex items-center justify-center">
                                        {getYouTubeId(video.url) ? (
                                            <>
                                                <img 
                                                    src={`https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg`} 
                                                    className="w-full h-full object-cover opacity-80" 
                                                    alt={video.title}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                                        <PlayCircle className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <video src={video.url} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                                    <PlayCircle className="w-12 h-12 text-white/80" />
                                                </div>
                                            </>
                                        )}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteVideo(video.id, video.url);
                                                }}
                                                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        {isEditing === video.id ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                                    defaultValue={video.title}
                                                    id={`edit-title-${video.id}`}
                                                />
                                                <select
                                                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                                                    defaultValue={video.category || 'all'}
                                                    id={`edit-category-${video.id}`}
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                    ))}
                                                </select>
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            const title = (document.getElementById(`edit-title-${video.id}`) as HTMLInputElement).value;
                                                            const category = (document.getElementById(`edit-category-${video.id}`) as HTMLSelectElement).value;
                                                            handleUpdateVideo(video.id, title, category);
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
                                                    <p className="text-white text-sm truncate font-medium" title={video.title}>{video.title}</p>
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-400 mt-1">
                                                        {categories.find(c => c.id === video.category)?.label || video.category || 'All'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setIsEditing(video.id)}
                                                    className="text-gray-500 hover:text-white"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-gray-500 text-xs mt-2">
                                            Added: {new Date(video.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {videos.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                No videos found. Upload one above.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
