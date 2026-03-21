// Material Design 3 Motion System
// https://m3.material.io/styles/motion/easing-and-duration/tokens-specs

export const mdMotion = {
  // Emphasized — for elements entering/exiting the screen
  emphasized: { duration: 0.5, ease: [0.2, 0, 0, 1.0] as [number, number, number, number] },
  emphasizedDecelerate: { duration: 0.4, ease: [0.05, 0.7, 0.1, 1.0] as [number, number, number, number] },
  emphasizedAccelerate: { duration: 0.2, ease: [0.3, 0.0, 0.8, 0.15] as [number, number, number, number] },

  // Standard — for simple transitions within the screen
  standard: { duration: 0.3, ease: [0.2, 0, 0, 1.0] as [number, number, number, number] },
  standardDecelerate: { duration: 0.25, ease: [0, 0, 0, 1.0] as [number, number, number, number] },
  standardAccelerate: { duration: 0.2, ease: [0.3, 0.0, 1.0, 1.0] as [number, number, number, number] },

  // Legacy (utility)
  linear: { duration: 0.2, ease: [0, 0, 1, 1] as [number, number, number, number] },
} as const;

// MD3 Transition Patterns

/** Fade Through — unrelated screens (bottom nav switch) */
export const fadeThrough = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: mdMotion.standardDecelerate },
  exit: { opacity: 0, scale: 0.92, transition: mdMotion.standardAccelerate },
};

/** Shared Axis — horizontal (tab navigation) */
export const sharedAxisH = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: mdMotion.emphasizedDecelerate },
  exit: { opacity: 0, x: -30, transition: mdMotion.emphasizedAccelerate },
};

/** Shared Axis — vertical (list → detail) */
export const sharedAxisV = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: mdMotion.emphasizedDecelerate },
  exit: { opacity: 0, y: -24, transition: mdMotion.emphasizedAccelerate },
};

/** Fade — tooltips, snackbars, loading */
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: mdMotion.standard },
  exit: { opacity: 0, transition: mdMotion.standardAccelerate },
};

/** Snackbar — slide up from bottom */
export const snackbarAnim = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: mdMotion.emphasizedDecelerate },
  exit: { opacity: 0, y: 20, transition: mdMotion.emphasizedAccelerate },
};

/** Bottom Sheet — slide up */
export const bottomSheet = {
  initial: { y: "100%" },
  animate: { y: 0, transition: mdMotion.emphasized },
  exit: { y: "100%", transition: mdMotion.emphasizedAccelerate },
};

/** Dialog — scale in */
export const dialogAnim = {
  initial: { opacity: 0, scale: 0.9, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: mdMotion.emphasizedDecelerate },
  exit: { opacity: 0, scale: 0.9, y: 8, transition: mdMotion.emphasizedAccelerate },
};

/** Page entry */
export const pageEntry = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: mdMotion.emphasizedDecelerate },
};

/** Stagger container */
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04 } },
};

/** Item entry (for list items) */
export const itemEntry = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: mdMotion.standard },
};

/** State layer press */
export const buttonPress = {
  whileTap: { scale: 0.97 },
};

/** Hover lift for cards */
export const hoverLift = {
  whileHover: { y: -2, transition: mdMotion.standard },
};
