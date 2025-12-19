import { 
    getPlayerInfo as getDbPlayerInfo, 
    getPlayerStats as getDbPlayerStats, 
    getCareerHighlights as getDbCareerHighlights, 
    getEducation as getDbEducation, 
    getHonours as getDbHonours, 
    getTestimonials as getDbTestimonials,
    PlayerInfo,
    PlayerStat,
    CareerHighlight,
    Education,
    Honour,
    Testimonial
} from '@/lib/supabase';
import { 
    PLAYER_INFO as CONST_PLAYER_INFO, 
    TECHNICAL_STATS as CONST_TECHNICAL_STATS, 
    PHYSICAL_STATS as CONST_PHYSICAL_STATS, 
    CAREER_HIGHLIGHTS as CONST_CAREER_HIGHLIGHTS, 
    EDUCATION as CONST_EDUCATION, 
    HONOURS as CONST_HONOURS,
    TESTIMONIAL as CONST_TESTIMONIAL
} from '@/lib/constants';

// --- Types that match the UI expectations (based on constants.ts) ---

export interface UIPlayerInfo {
    fullName: string;
    age: string;
    height: string;
    weight: string;
    nationality: string[];
    position: string;
    footedness: string;
    location: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    youtube: string;
    heroImage?: string;
}

export interface UIStat {
    label: string;
    value: string;
    category: string;
}

export interface UICareerHighlight {
    id: number | string;
    title: string;
    description: string;
    details: string[];
    icon: string;
    year: string;
}

export interface UIEducation {
    degree: string;
    institution: string;
    year: string;
    details: string;
    website: string;
}

export interface UITestimonial {
    text: string;
    coach: string;
    title: string;
}

// --- Fetching Functions with Fallback ---

export async function fetchPlayerProfile(): Promise<UIPlayerInfo> {
    try {
        const data = await getDbPlayerInfo();
        if (data) {
            return {
                fullName: data.full_name || CONST_PLAYER_INFO.fullName,
                age: data.age || CONST_PLAYER_INFO.age,
                height: data.height || CONST_PLAYER_INFO.height,
                weight: data.weight || CONST_PLAYER_INFO.weight,
                nationality: (data.nationality && data.nationality.length > 0) ? data.nationality : CONST_PLAYER_INFO.nationality,
                position: data.position || CONST_PLAYER_INFO.position,
                footedness: data.footedness || CONST_PLAYER_INFO.footedness,
                location: data.location || CONST_PLAYER_INFO.location,
                tagline: data.tagline || CONST_PLAYER_INFO.tagline,
                email: data.email || CONST_PLAYER_INFO.email,
                phone: data.phone || CONST_PLAYER_INFO.phone,
                whatsapp: data.whatsapp || CONST_PLAYER_INFO.whatsapp,
                instagram: data.instagram || CONST_PLAYER_INFO.instagram,
                youtube: data.youtube || CONST_PLAYER_INFO.youtube,
                heroImage: data.hero_image_url || CONST_PLAYER_INFO.heroImage
            };
        }
    } catch (error) {
        console.warn('Error fetching player info from DB, using fallback:', error);
    }
    return CONST_PLAYER_INFO;
}

export async function fetchTechnicalStats(): Promise<UIStat[]> {
    try {
        const data = await getDbPlayerStats();
        if (data && data.length > 0) {
            return data
                .filter(s => s.category === 'performance' || s.category === 'technical')
                .map(s => ({
                    label: s.label,
                    value: s.value,
                    category: s.category
                }));
        }
    } catch (error) {
        console.warn('Error fetching technical stats from DB, using fallback:', error);
    }
    return CONST_TECHNICAL_STATS;
}

export async function fetchPhysicalStats(): Promise<UIStat[]> {
    try {
        const data = await getDbPlayerStats();
        if (data && data.length > 0) {
            // If we have stats categorized as 'physical' in DB, use them.
            // Note: The schema has a 'category' column.
            const physical = data.filter(s => s.category === 'physical');
            if (physical.length > 0) {
                return physical.map(s => ({
                    label: s.label,
                    value: s.value,
                    category: s.category
                }));
            }
        }
    } catch (error) {
        console.warn('Error fetching physical stats from DB, using fallback:', error);
    }
    return CONST_PHYSICAL_STATS;
}

export async function fetchHighlights(): Promise<UICareerHighlight[]> {
    try {
        const data = await getDbCareerHighlights();
        if (data && data.length > 0) {
            return data.map(h => ({
                id: h.id,
                title: h.title,
                description: h.description,
                details: h.details ? h.details.map(d => d.detail) : [],
                icon: h.icon || '⚽',
                year: h.year
            }));
        }
    } catch (error) {
        console.warn('Error fetching highlights from DB, using fallback:', error);
    }
    return CONST_CAREER_HIGHLIGHTS;
}

export async function fetchEducation(): Promise<UIEducation[]> {
    try {
        const data = await getDbEducation();
        if (data && data.length > 0) {
            return data.map(e => ({
                degree: e.degree,
                institution: e.institution,
                year: e.year,
                details: e.details || '',
                website: e.website || ''
            }));
        }
    } catch (error) {
        console.warn('Error fetching education from DB, using fallback:', error);
    }
    return CONST_EDUCATION;
}

export async function fetchHonours(): Promise<string[]> {
    try {
        const data = await getDbHonours();
        if (data && data.length > 0) {
            return data.map(h => h.title);
        }
    } catch (error) {
        console.warn('Error fetching honours from DB, using fallback:', error);
    }
    return CONST_HONOURS;
}

export async function fetchTestimonial(): Promise<UITestimonial> {
    try {
        const data = await getDbTestimonials();
        if (data && data.length > 0) {
            // Assuming we just want the first one or a random one to match the single object structure of CONST_TESTIMONIAL
            const first = data[0];
            return {
                text: first.text,
                coach: first.coach,
                title: first.title || ''
            };
        }
    } catch (error) {
        console.warn('Error fetching testimonial from DB, using fallback:', error);
    }
    return CONST_TESTIMONIAL;
}
