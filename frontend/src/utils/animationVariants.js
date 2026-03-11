
export const listFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,       // slight delay between each child
      delayChildren: 0.1,
    },
  },
};

export const itemSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export const tabSlide = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
  exit: { opacity: 0, x: -40, transition: { duration: 0.15 } },
};

export const fieldAppear = {
  hidden: { opacity: 0, y: -16, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 22 },
  },
  exit: {
    opacity: 0, y: -16, scale: 0.97,
    transition: { duration: 0.15 },
  },
};

export const cardHover = {
  rest: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const overlayVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalVariant = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.15 } },
};

export const loadingPulse = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const checkMarkPop = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 15, delay: 0.1 },
  },
};
