import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    Icon?: React.ComponentType<{ className?: string }>;
    className?: string;
}

export default function CTAButton({
    href,
    onClick,
    children,
    variant = 'primary',
    Icon = ArrowRight,
    className = '',
}: CTAButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 font-display font-semibold text-sm sm:text-base uppercase tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105';

    const variants = {
        primary: 'bg-benfica-red text-white hover:bg-red-700 shadow-lg hover:shadow-xl',
        secondary: 'bg-benfica-gold text-black hover:bg-yellow-600 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-white text-white hover:bg-white hover:text-black',
    };

    const buttonClasses = `${baseStyles} ${variants[variant]} ${className}`;

    const content = (
        <>
            <span>{children}</span>
            <Icon className="w-5 h-5" />
        </>
    );

    if (href) {
        return (
            <Link
                href={href} className={buttonClasses}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses}>
            {content}
        </button>
    );
}
