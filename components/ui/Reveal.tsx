'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    variant?: 'slide' | 'fade' | 'scale' | 'blur';
    className?: string;
}

export const Reveal = ({ children, width = 'fit-content', delay = 0.25, variant = 'slide', className = '' }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const mainControls = useAnimation();
    const slideControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start('visible');
            slideControls.start('visible');
        }
    }, [isInView, mainControls, slideControls]);

    const getVariants = (): Variants => {
        switch (variant) {
            case 'fade':
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                };
            case 'scale':
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                };
            case 'blur':
                return {
                    hidden: { opacity: 0, filter: 'blur(10px)' },
                    visible: { opacity: 1, filter: 'blur(0px)' },
                };
            case 'slide':
            default:
                return {
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                };
        }
    };

    return (
        <div ref={ref} className={className} style={{ position: 'relative', width, overflow: variant === 'slide' ? 'hidden' : 'visible' }}>
            <motion.div
                variants={getVariants()}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.5, delay: delay }}
            >
                {children}
            </motion.div>
            
            {variant === 'slide' && (
                <motion.div
                    variants={{
                        hidden: { left: 0 },
                        visible: { left: '100%' },
                    }}
                    initial="hidden"
                    animate={slideControls}
                    transition={{ duration: 0.5, ease: 'easeIn' }}
                    style={{
                        position: 'absolute',
                        top: 4,
                        bottom: 4,
                        left: 0,
                        right: 0,
                        background: '#008751', // Nigeria Green
                        zIndex: 20,
                    }}
                />
            )}
        </div>
    );
};
