import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Types ---

export interface GalleryPhoto {
    id: string;
    url: string;
    caption?: string;
    category?: string;
    display_order: number;
    created_at: string;
}

export interface GalleryVideo {
    id: string;
    url: string;
    thumbnail_url?: string;
    title?: string;
    description?: string;
    category?: string;
    display_order: number;
    created_at: string;
}

export interface PlayerStat {
    id: string;
    label: string;
    value: string;
    category: 'performance' | 'technical' | 'physical';
    display_order: number;
    created_at: string;
}

export interface Testimonial {
    id: string;
    text: string;
    coach: string;
    title?: string;
    display_order: number;
    created_at: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    created_at: string;
    read: boolean;
}

export interface CareerHighlight {
    id: string;
    title: string;
    description: string;
    year: string;
    icon?: string;
    display_order: number;
    created_at: string;
    // For joined queries
    details?: CareerHighlightDetail[];
}

export interface CareerHighlightDetail {
    id: string;
    highlight_id: string;
    detail: string;
    display_order: number;
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
    year: string;
    details?: string;
    website?: string;
    display_order: number;
    created_at: string;
}

export interface Honour {
    id: string;
    title: string;
    display_order: number;
    created_at: string;
}

export interface PlayerSkill {
    id: string;
    category: string;
    skill: string;
    display_order: number;
    created_at: string;
}

export interface PlayerInfo {
    id: string;
    full_name: string;
    age: string;
    height: string;
    weight: string;
    nationality: string[];
    languages?: string[];
    position: string;
    footedness: string;
    location: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    youtube: string;
    hero_image_url?: string;
    updated_at: string;
}

// --- Helpers ---

// Photos
export async function getPhotos() {
    const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching photos:', error);
        return [];
    }
    return data as GalleryPhoto[];
}

export async function deletePhoto(id: string) {
    const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
    if (error) throw error;
}

// Videos
export async function getVideos() {
    const { data, error } = await supabase
        .from('gallery_videos')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
    return data as GalleryVideo[];
}

export async function deleteVideo(id: string) {
    const { error } = await supabase.from('gallery_videos').delete().eq('id', id);
    if (error) throw error;
}

// Stats
export async function getPlayerStats() {
    const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching stats:', error);
        return [];
    }
    return data as PlayerStat[];
}

// Testimonials
export async function getTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
    return data as Testimonial[];
}

// Career Highlights
export async function getCareerHighlights() {
    const { data, error } = await supabase
        .from('career_highlights')
        .select(`
            *,
            details:career_highlight_details(*)
        `)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching highlights:', error);
        return [];
    }
    return data as CareerHighlight[];
}

// Education
export async function getEducation() {
    const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching education:', error);
        return [];
    }
    return data as Education[];
}

// Honours
export async function getHonours() {
    const { data, error } = await supabase
        .from('honours')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching honours:', error);
        return [];
    }
    return data as Honour[];
}

// Skills
export async function getPlayerSkills() {
    const { data, error } = await supabase
        .from('player_skills')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
    return data as PlayerSkill[];
}

// Player Info
export async function getPlayerInfo() {
    const { data, error } = await supabase
        .from('player_info')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching player info:', error);
        return null;
    }
    return data as PlayerInfo;
}

export async function updatePlayerInfo(id: string, updates: Partial<PlayerInfo>) {
    const { data, error } = await supabase
        .from('player_info')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating player info:', error);
        throw error;
    }
    return data as PlayerInfo;
}

// Contact
export async function submitContact(formData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
}) {
    const { data, error } = await supabase
        .from('contact_submissions')
        .insert([formData])
        .select();

    if (error) {
        console.error('Error submitting contact:', error);
        throw error;
    }
    return data;
}
