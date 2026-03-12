/**
 * Shared animation variants and utilities for patient pages.
 * Uses framer-motion for all animations.
 */

// Easing curves
const smoothEase = [0.22, 1, 0.36, 1];
const springEase = [0.34, 1.56, 0.64, 1];

// --------------- Container Variants ---------------

/** Stagger container – wraps children that use `itemVariants` */
export const staggerContainer = (staggerDelay = 0.08) => ({
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
        },
    },
});

// --------------- Item / Element Variants ---------------

/** Fade + slide up (default item entrance) */
export const fadeSlideUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: smoothEase },
    },
};

/** Fade + slide from left (header badge / title) */
export const slideFromLeft = {
    hidden: { opacity: 0, x: -24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: smoothEase },
    },
};

/** Scale entrance (cards, code reveal) */
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: springEase },
    },
};

/** Fade only */
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4 },
    },
};

// --------------- Hover / Tap Presets ---------------

/** Card hover – subtle lift + shadow  */
export const cardHover = {
    whileHover: {
        y: -4,
        scale: 1.015,
        transition: { duration: 0.25, ease: smoothEase },
    },
    whileTap: {
        scale: 0.98,
        transition: { duration: 0.15 },
    },
};

/** Button press */
export const buttonTap = {
    whileTap: { scale: 0.95, transition: { duration: 0.1 } },
};

// --------------- Page-level Wrapper ---------------

/** Full page content entrance */
export const pageTransition = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: smoothEase },
};

/** Header entrance */
export const headerEntrance = {
    initial: { opacity: 0, y: -12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: smoothEase },
};  

