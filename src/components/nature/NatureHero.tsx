import { motion } from "framer-motion";
import { Wind, Droplets } from "lucide-react";
import { FractalTreeCanvas } from "./FractalTreeCanvas";
import { FloatingLeaf } from "./FloatingLeaf";

export const NatureHero = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 1.5,
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <FractalTreeCanvas />

      {[...Array(8)].map((_, i) => (
        <FloatingLeaf key={i} delay={i * 2} />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent z-10"></div>

      <div className="relative z-20 text-center p-6">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 backdrop-blur-sm"
        >
          <Wind className="h-4 w-4 text-emerald-300" />
          <span className="text-sm font-medium text-emerald-100">
            Organic Growth Platform
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-emerald-100 to-emerald-400"
        >
          Nature's Harmony
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-lg text-emerald-200 mb-10"
        >
          Experience the beauty of natural growth patterns. Watch as organic
          structures emerge and evolve, creating a living, breathing digital
          ecosystem.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-600 transition-colors duration-300 flex items-center gap-2">
            Explore Nature
            <Droplets className="h-5 w-5" />
          </button>
          <button className="px-8 py-4 bg-emerald-900/50 text-emerald-100 font-semibold rounded-lg border border-emerald-500/30 hover:bg-emerald-900/70 transition-colors duration-300 backdrop-blur-sm">
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
};
