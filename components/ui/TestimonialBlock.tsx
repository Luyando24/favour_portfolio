import { Quote } from 'lucide-react';

interface TestimonialBlockProps {
    text: string;
    coach: string;
    title?: string;
}

export default function TestimonialBlock({
    text,
    coach,
    title,
}: TestimonialBlockProps) {
    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 sm:p-12 shadow-2xl">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-24 h-24 text-benfica-red" />
            </div>

            {/* Testimonial Text */}
            <div className="relative z-10">
                <div className="mb-6">
                    <Quote className="w-10 h-10 text-benfica-red mb-4" />
                </div>

                <blockquote className="text-white text-lg sm:text-xl leading-relaxed mb-8 italic">
                    &ldquo;{text}&rdquo;
                </blockquote>

                {/* Coach Info */}
                <div className="flex items-center space-x-4">
                    <div className="w-1 h-16 bg-benfica-red"></div>
                    <div>
                        <div className="text-white font-display font-bold text-lg">
                            {coach}
                        </div>
                        {title && (
                            <div className="text-gray-400 text-sm mt-1">
                                {title}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-benfica-red/10 rounded-full -ml-16 -mb-16"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-benfica-gold/10 rounded-full -mr-12 -mt-12"></div>
        </div>
    );
}
