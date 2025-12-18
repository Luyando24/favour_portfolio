import { NextResponse } from 'next/server';
import { PLAYER_INFO, TECHNICAL_STATS, PHYSICAL_STATS, CAREER_HIGHLIGHTS, TESTIMONIAL, CHARACTER_DATA, PLAYER_SUMMARY } from '@/lib/constants';
import { jsPDF } from 'jspdf';

export async function GET() {
    try {
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
        doc.text(PLAYER_INFO.fullName.toUpperCase(), 20, 18);

        // Title
        doc.setTextColor(212, 175, 55); // Gold
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(PLAYER_INFO.position.toUpperCase(), 20, 26);

        // Contact Info (Right aligned in header)
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(PLAYER_INFO.email, 190, 15, { align: 'right' });
        doc.text(PLAYER_INFO.location, 190, 20, { align: 'right' });
        // doc.text('davidaraj.com', 190, 25, { align: 'right' }); // Website not available

        yPos = 50;

        // --- PLAYER SUMMARY ---
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        const summaryLines = doc.splitTextToSize(`"${PLAYER_SUMMARY}"`, 170);
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
            ['Age', `${PLAYER_INFO.age} Years`],
            ['Height', PLAYER_INFO.height],
            ['Weight', PLAYER_INFO.weight],
            ['Nationality', PLAYER_INFO.nationality.join(', ')],
            ['Footedness', PLAYER_INFO.footedness],
            ['Location', PLAYER_INFO.location]
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

        TECHNICAL_STATS.slice(0, 6).forEach(stat => {
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

        // Filter out Height/Weight as they are in profile
        const physicalMetrics = PHYSICAL_STATS.filter(s => s.label !== 'Height' && s.label !== 'Weight');

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

        CAREER_HIGHLIGHTS.forEach(h => {
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

        const testimonialLines = doc.splitTextToSize(`"${TESTIMONIAL.text}"`, 160);
        doc.text(testimonialLines, 25, yPos + 10);

        yPos += (testimonialLines.length * 5) + 15;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`- ${TESTIMONIAL.coach}`, 180, yPos - 5, { align: 'right' });
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(TESTIMONIAL.title, 180, yPos, { align: 'right' });

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
            doc.text(`${PLAYER_INFO.fullName} - Professional Portfolio`, 20, 285);
            doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
        }

        const pdfBuffer = doc.output('arraybuffer');

        const filename = `${PLAYER_INFO.fullName.replace(/\s+/g, '_')}_Profile.pdf`;

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
