'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/Sidebar';
import { UserPlus, Trash2, User, Loader2, AlertCircle, Key, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAdminCredentials } from '@/lib/admin-auth';

interface AdminUser {
    id: string;
    email: string;
    created_at: string;
}

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [creating, setCreating] = useState(false);
    const [createSuccess, setCreateSuccess] = useState('');
    const [resettingId, setResettingId] = useState<string | null>(null);
    const [resetPassword, setResetPassword] = useState('');

    const fetchAdmins = async () => {
        setLoading(true);
        setError('');
        
        try {
            const creds = getAdminCredentials();
            if (!creds.email || !creds.password) {
                throw new Error('No admin credentials found');
            }

            const { data, error: rpcError } = await supabase.rpc('admin_list_users', {
                p_operator_email: creds.email,
                p_operator_password: creds.password
            });

            if (rpcError) throw rpcError;
            setAdmins(data || []);
        } catch (err: any) {
            console.error('Error fetching admins:', err);
            setError(err.message || 'Failed to fetch admin users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setError('');
        setCreateSuccess('');

        try {
            const creds = getAdminCredentials();
            if (!creds.email || !creds.password) {
                throw new Error('No admin credentials found');
            }

            const { error: rpcError } = await supabase.rpc('admin_create_user', {
                p_operator_email: creds.email,
                p_operator_password: creds.password,
                p_new_email: newEmail,
                p_new_password: newPassword
            });

            if (rpcError) throw rpcError;

            setCreateSuccess('Admin user created successfully!');
            setNewEmail('');
            setNewPassword('');
            fetchAdmins();
        } catch (err: any) {
            console.error('Error creating admin:', err);
            setError(err.message || 'Failed to create admin user');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!confirm('Are you sure you want to delete this admin user? This cannot be undone.')) return;

        try {
            const creds = getAdminCredentials();
            if (!creds.email || !creds.password) {
                throw new Error('No admin credentials found');
            }

            const { error: rpcError } = await supabase.rpc('admin_delete_user', {
                p_operator_email: creds.email,
                p_operator_password: creds.password,
                p_target_id: id
            });

            if (rpcError) throw rpcError;

            fetchAdmins();
        } catch (err: any) {
            console.error('Error deleting admin:', err);
            alert(err.message || 'Failed to delete admin user');
        }
    };

    const handleResetPassword = async (id: string) => {
        if (!resetPassword || resetPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const creds = getAdminCredentials();
            if (!creds.email || !creds.password) {
                throw new Error('No admin credentials found');
            }

            const { error: rpcError } = await supabase.rpc('admin_reset_password', {
                p_operator_email: creds.email,
                p_operator_password: creds.password,
                p_target_id: id,
                p_new_password: resetPassword
            });

            if (rpcError) throw rpcError;

            alert('Password updated successfully');
            setResettingId(null);
            setResetPassword('');
        } catch (err: any) {
            console.error('Error resetting password:', err);
            alert(err.message || 'Failed to reset password');
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-black">
                <AdminSidebar />

                <main className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-4xl font-display font-bold text-white mb-2">Admin Management</h1>
                            <p className="text-gray-400">Manage who has access to the admin dashboard</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* List Admins */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-benfica-red" />
                                        Existing Admins
                                    </h2>

                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="w-8 h-8 text-benfica-red animate-spin" />
                                        </div>
                                    ) : error && !admins.length ? (
                                        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                            {error}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-gray-800 text-gray-400 text-sm">
                                                        <th className="pb-3 pl-2">Email</th>
                                                        <th className="pb-3">Created At</th>
                                                        <th className="pb-3 pr-2 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-300">
                                                    {admins.map((admin) => (
                                                        <tr key={admin.id} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                                                            <td className="py-4 pl-2 font-medium text-white">{admin.email}</td>
                                                            <td className="py-4 text-sm text-gray-500">
                                                                {new Date(admin.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="py-4 pr-2 text-right">
                                                                {resettingId === admin.id ? (
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <input
                                                                            type="password"
                                                                            placeholder="New Password"
                                                                            value={resetPassword}
                                                                            onChange={(e) => setResetPassword(e.target.value)}
                                                                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm w-32 focus:border-benfica-gold outline-none"
                                                                            autoFocus
                                                                        />
                                                                        <button
                                                                            onClick={() => handleResetPassword(admin.id)}
                                                                            className="p-1 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                                                                            title="Save Password"
                                                                        >
                                                                            <Check className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setResettingId(null);
                                                                                setResetPassword('');
                                                                            }}
                                                                            className="p-1 text-gray-500 hover:bg-gray-500/10 rounded transition-colors"
                                                                            title="Cancel"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button
                                                                            onClick={() => {
                                                                                setResettingId(admin.id);
                                                                                setResetPassword('');
                                                                            }}
                                                                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                                            title="Reset Password"
                                                                        >
                                                                            <Key className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteAdmin(admin.id)}
                                                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                            title="Delete Admin"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Create Admin Form */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-8">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                        <UserPlus className="w-5 h-5 mr-2 text-benfica-gold" />
                                        Add New Admin
                                    </h2>

                                    {createSuccess && (
                                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm">
                                            {createSuccess}
                                        </div>
                                    )}

                                    {error && admins.length > 0 && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-start">
                                            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-benfica-gold focus:outline-none"
                                                placeholder="new_admin@example.com"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-benfica-gold focus:outline-none"
                                                placeholder="Secure password"
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={creating}
                                            className="w-full bg-benfica-gold hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {creating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Admin User'
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
