import { NextResponse } from 'next/server';
import { 
    PLAYER_INFO as CONST_PLAYER_INFO, 
    TECHNICAL_STATS as CONST_TECHNICAL_STATS, 
    PHYSICAL_STATS as CONST_PHYSICAL_STATS, 
    CAREER_HIGHLIGHTS as CONST_CAREER_HIGHLIGHTS, 
    TESTIMONIAL as CONST_TESTIMONIAL, 
    CHARACTER_DATA, 
    PLAYER_SUMMARY 
} from '@/lib/constants';
import { 
    getPlayerInfo, 
    getPlayerStats, 
    getCareerHighlights, 
    getTestimonials 
} from '@/lib/supabase';
import { jsPDF } from 'jspdf';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET() {
    try {
        // Fetch dynamic data from Supabase
        const [
            dbPlayerInfo,
            dbStats,
            dbHighlights,
            dbTestimonials
        ] = await Promise.all([
            getPlayerInfo(),
            getPlayerStats(),
            getCareerHighlights(),
            getTestimonials()
        ]);

        // --- PREPARE DATA ---

        // Player Info
        const playerInfo = dbPlayerInfo ? {
            fullName: dbPlayerInfo.full_name,
            position: dbPlayerInfo.position,
            email: dbPlayerInfo.email,
            location: dbPlayerInfo.location,
            age: dbPlayerInfo.age,
            height: dbPlayerInfo.height,
            weight: dbPlayerInfo.weight,
            nationality: dbPlayerInfo.nationality || [],
            footedness: dbPlayerInfo.footedness,
            tagline: dbPlayerInfo.tagline
        } : CONST_PLAYER_INFO;

        // Stats
        let technicalStats = CONST_TECHNICAL_STATS;
        let physicalStats = CONST_PHYSICAL_STATS;

        if (dbStats && dbStats.length > 0) {
            // Filter DB stats. 
            // Assuming 'performance' category maps to Technical/Key Metrics
            // Assuming 'measurement' or 'physical' category maps to Physical
            
            const dbTechnical = dbStats.filter(s => s.category === 'performance' || s.category === 'technical');
            if (dbTechnical.length > 0) {
                technicalStats = dbTechnical.map(s => ({
                    label: s.label,
                    value: s.value,
                    category: s.category
                }));
            }

            const dbPhysical = dbStats.filter(s => s.category === 'physical');
            if (dbPhysical.length > 0) {
                physicalStats = dbPhysical.map(s => ({
                    label: s.label,
                    value: s.value,
                    category: s.category
                }));
            }
        }

        // Highlights
        const highlights = (dbHighlights && dbHighlights.length > 0) ? dbHighlights.map(h => ({
            title: h.title,
            year: h.year,
            description: h.description,
            details: h.details ? h.details.map(d => d.detail) : []
        })) : CONST_CAREER_HIGHLIGHTS;

        // Testimonial
        const testimonial = (dbTestimonials && dbTestimonials.length > 0) ? {
            text: dbTestimonials[0].text,
            coach: dbTestimonials[0].coach,
            title: dbTestimonials[0].title || ''
        } : CONST_TESTIMONIAL;

        // Summary - Use tagline if available and long enough, otherwise constant
        // Or strictly use constant as tagline is usually short. 
        // Let's use constant for summary for now as DB doesn't have a 'bio' field.
        const summary = PLAYER_SUMMARY;


        // --- GENERATE PDF ---
        const doc = new jsPDF();

        // Colors
        const RED = [227, 6, 19];
        const GOLD = [212, 175, 55];
        const BLACK = [0, 0, 0];
        const DARK_GRAY = [30, 30, 30];
        const LIGHT_GRAY = [240, 240, 240];

        let yPos = 0;

        // --- HEADER ---
        // Black background
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, 'F');

        // Red accent line
        doc.setDrawColor(227, 6, 19);
        doc.setLineWidth(1);
        doc.line(0, 39, 210, 39);

        // Name
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text(playerInfo.fullName.toUpperCase(), 20, 18);

        // Title
        doc.setTextColor(212, 175, 55); // Gold
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(playerInfo.position.toUpperCase(), 20, 26);

        // Contact Info (Right aligned in header)
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(playerInfo.email, 190, 15, { align: 'right' });
        doc.text(playerInfo.location, 190, 20, { align: 'right' });
        // doc.text('davidaraj.com', 190, 25, { align: 'right' }); // Website not available

        yPos = 50;

        // --- PLAYER SUMMARY ---
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        const summaryLines = doc.splitTextToSize(`"${summary}"`, 170);
        doc.text(summaryLines, 20, yPos);
        yPos += (summaryLines.length * 6) + 10;

        // --- TWO COLUMN LAYOUT ---
        const leftColX = 20;
        const rightColX = 115;
        let leftY = yPos;
        let rightY = yPos;

        // LEFT COLUMN: Basic Info & Character

        // Section: Profile
        doc.setFillColor(245, 245, 245);
        doc.rect(leftColX - 2, leftY - 4, 85, 8, 'F');
        doc.setTextColor(227, 6, 19); // Red
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PLAYER PROFILE', leftColX, leftY + 1);
        leftY += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const profileData = [
            ['Age', `${playerInfo.age} Years`],
            ['Height', playerInfo.height],
            ['Weight', playerInfo.weight],
            ['Nationality', playerInfo.nationality.join(', ')],
            ['Footedness', playerInfo.footedness],
            ['Location', playerInfo.location]
        ];

        profileData.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, leftColX, leftY);
            doc.setFont('helvetica', 'normal');
            doc.text(value, leftColX + 25, leftY);
            leftY += 6;
        });
        leftY += 10;

        // Section: Character & Academics
        doc.setFillColor(245, 245, 245);
        doc.rect(leftColX - 2, leftY - 4, 85, 8, 'F');
        doc.setTextColor(227, 6, 19);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CHARACTER & ACADEMICS', leftColX, leftY + 1);
        leftY += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        const characterData = [
            ['GPA', CHARACTER_DATA.gpa],
            ['Training', CHARACTER_DATA.trainingVolume],
            ['Attendance', 'Zero unexcused absences'],
            ['Family', 'Stable & Supportive']
        ];

        characterData.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, leftColX, leftY);
            doc.setFont('helvetica', 'normal');
            doc.text(value, leftColX + 25, leftY);
            leftY += 6;
        });


        // RIGHT COLUMN: Stats & Metrics

        // Section: Key Metrics
        doc.setFillColor(245, 245, 245);
        doc.rect(rightColX - 2, rightY - 4, 85, 8, 'F');
        doc.setTextColor(227, 6, 19);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('KEY METRICS', rightColX, rightY + 1);
        rightY += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        technicalStats.slice(0, 6).forEach(stat => {
            doc.setFont('helvetica', 'bold');
            doc.text(stat.label, rightColX, rightY);
            doc.setFont('helvetica', 'normal');
            doc.text(stat.value, rightColX + 65, rightY, { align: 'right' });

            // Progress bar background
            doc.setFillColor(230, 230, 230);
            doc.rect(rightColX, rightY + 2, 65, 1.5, 'F');

            // Progress bar fill (simulated based on value if percentage)
            let width = 40; // default
            if (stat.value.includes('%')) {
                width = (parseInt(stat.value) / 100) * 65;
            }
            doc.setFillColor(212, 175, 55); // Gold
            doc.rect(rightColX, rightY + 2, width, 1.5, 'F');

            rightY += 10;
        });

        // Section: Physical
        rightY += 5;
        doc.setFillColor(245, 245, 245);
        doc.rect(rightColX - 2, rightY - 4, 85, 8, 'F');
        doc.setTextColor(227, 6, 19);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PHYSICAL DATA', rightColX, rightY + 1);
        rightY += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        // Filter out Height/Weight as they are in profile if they exist in stats
        const physicalMetrics = physicalStats.filter(s => s.label !== 'Height' && s.label !== 'Weight');

        physicalMetrics.forEach(stat => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${stat.label}:`, rightColX, rightY);
            doc.setFont('helvetica', 'normal');
            doc.text(stat.value, rightColX + 35, rightY);
            rightY += 6;
        });

        // Sync Y position to lowest column
        yPos = Math.max(leftY, rightY) + 15;

        // --- CAREER HIGHLIGHTS ---
        doc.setFillColor(0, 0, 0); // Black header for major section
        doc.rect(20, yPos - 6, 170, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CAREER HIGHLIGHTS & VALIDATION', 25, yPos);
        yPos += 15;

        doc.setTextColor(0, 0, 0);

        highlights.forEach(h => {
            // Check for page break
            if (yPos > 260) {
                doc.addPage();
                yPos = 20;
            }

            // Highlight Box
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);
            doc.rect(20, yPos - 2, 170, 25 + (h.details.length * 5));

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(227, 6, 19); // Red title
            doc.text(h.title, 25, yPos + 4);

            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.text(h.year, 185, yPos + 4, { align: 'right' });

            yPos += 10;

            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(h.description, 25, yPos);
            yPos += 6;

            // Bullets
            doc.setFontSize(9);
            h.details.forEach(d => {
                doc.setTextColor(212, 175, 55); // Gold bullet
                doc.text('•', 25, yPos);
                doc.setTextColor(50, 50, 50);
                doc.text(d, 30, yPos);
                yPos += 5;
            });

            yPos += 10;
        });

        // --- TESTIMONIAL ---
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 5;
        }

        doc.setDrawColor(212, 175, 55); // Gold border
        doc.setLineWidth(0.5);
        doc.rect(20, yPos, 170, 40);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(50, 50, 50);

        const testimonialLines = doc.splitTextToSize(`"${testimonial.text}"`, 160);
        doc.text(testimonialLines, 25, yPos + 10);

        yPos += (testimonialLines.length * 5) + 15;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`- ${testimonial.coach}`, 180, yPos - 5, { align: 'right' });
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(testimonial.title || '', 180, yPos, { align: 'right' });

        // --- FOOTER ---
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            // Footer Line
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);
            doc.line(20, 280, 190, 280);

            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`${playerInfo.fullName} - Professional Portfolio`, 20, 285);
            doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
        }

        const pdfBuffer = doc.output('arraybuffer');

        const filename = `${playerInfo.fullName.replace(/\s+/g, '_')}_Profile.pdf`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
