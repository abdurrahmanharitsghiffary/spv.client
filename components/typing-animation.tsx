"use client";
import { Variants, motion } from "framer-motion";
export default function TypingAnimation() {
  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.03,
      },
    },
  };

  const childVariants: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
  };

  return (
    <motion.div
      className="p-4 flex gap-2 bg-default w-fit rounded-medium"
      variants={containerVariants}
      animate="animate"
    >
      {[1, 2, 3].map((item) => (
        <motion.span
          variants={childVariants}
          key={item}
          className="bg-default-900 rounded-full w-4 h-4 aspect-square"
        ></motion.span>
      ))}
    </motion.div>
  );
}
