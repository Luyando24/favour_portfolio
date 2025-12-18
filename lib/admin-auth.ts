import { supabase } from './supabase';

export async function checkAdminPassword(password: string, email: string): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('admin_login', {
            p_email: email,
            p_password: password
        });

        if (error) {
            console.error('Error verifying admin credentials:', error);
            return false;
        }

        return !!data;
    } catch (err) {
        console.error('Unexpected error during admin login:', err);
        return false;
    }
}

export function setAdminSession(email: string, password?: string) {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_email', email);
        if (password) {
            // In a real app with proper JWT auth, we wouldn't store password.
            // But since we are using RPCs that require re-authentication for sensitive actions,
            // we'll store it in session storage (cleared on tab close).
            // A better approach would be to return a JWT from the RPC, but that's a bigger change.
            sessionStorage.setItem('admin_token', password); 
        }
    }
}

export function clearAdminSession() {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_email');
        sessionStorage.removeItem('admin_token');
    }
}

export function isAdminAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('admin_authenticated') === 'true';
    }
    return false;
}

export function getAdminCredentials() {
    if (typeof window !== 'undefined') {
        return {
            email: sessionStorage.getItem('admin_email'),
            password: sessionStorage.getItem('admin_token')
        };
    }
    return { email: null, password: null };
}
