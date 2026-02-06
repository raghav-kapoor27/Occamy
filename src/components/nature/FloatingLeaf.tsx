import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingLeafProps {
  delay?: number;
}

export const FloatingLeaf = ({ delay = 0 }: FloatingLeafProps) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [startX] = useState(() => Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920));

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <motion.div
      className="absolute text-emerald-400/30"
      initial={{ x: startX, y: -50, rotate: 0 }}
      animate={{
        y: dimensions.height + 50,
        x: Math.random() * dimensions.width,
        rotate: 360,
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Leaf className="h-6 w-6" />
    </motion.div>
  );
};
