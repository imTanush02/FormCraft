
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animationVariants';

export default function AnimatedContainer({
  children,
  variants = fadeUp,
  className = '',
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
