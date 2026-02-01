import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import thalLogo from "@/assets/thal-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    // Slower timing for dramatic effect
    const textTimer = setTimeout(() => setPhase("text"), 2500);
    const exitTimer = setTimeout(() => setPhase("exit"), 4500);
    const completeTimer = setTimeout(() => onComplete(), 5500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 1 }}
        onAnimationComplete={() => {
          if (phase === "exit") onComplete();
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
                opacity: 0 
              }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
                y: [null, Math.random() * -200]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Main glow effect behind logo */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(38 92% 50% / 0.2) 0%, transparent 60%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 0.8, 0.6]
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />

        {/* Secondary pulsing glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(38 92% 50% / 0.15) 0%, transparent 70%)",
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative flex flex-col items-center">
          {/* Logo Container with multiple animation layers */}
          <div className="relative mb-10">
            {/* Outer ring animation */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ 
                scale: [1.5, 1.1, 1.05],
                opacity: [0, 0.5, 0],
                rotate: [0, 180]
              }}
              transition={{ 
                duration: 2,
                delay: 0.5,
                ease: "easeOut"
              }}
              style={{
                border: "2px solid hsl(38 92% 50% / 0.5)",
              }}
            />

            {/* Logo with slow reveal */}
            <motion.div
              initial={{ 
                scale: 0.3, 
                opacity: 0,
                filter: "blur(20px)"
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                filter: "blur(0px)"
              }}
              transition={{ 
                duration: 1.8, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3
              }}
              className="relative"
            >
              {/* Glow behind logo */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ 
                  boxShadow: [
                    "0 0 0px hsl(38 92% 50% / 0)",
                    "0 0 80px hsl(38 92% 50% / 0.6)",
                    "0 0 40px hsl(38 92% 50% / 0.4)",
                  ]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              
              {/* Logo image */}
              <motion.div
                className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-foreground relative"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                transition={{ 
                  duration: 1.5,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={thalLogo}
                  alt="THAL Logo"
                  className="w-full h-full object-contain"
                />
                
                {/* Shine effect across logo */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ 
                    duration: 1.5,
                    delay: 1.5,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Brand Name with staggered letters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "text" || phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center overflow-hidden">
              {"THAL".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ 
                    y: phase === "text" || phase === "exit" ? 0 : 60, 
                    opacity: phase === "text" || phase === "exit" ? 1 : 0 
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="font-heading text-6xl md:text-8xl font-bold text-foreground tracking-wider text-glow inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: phase === "text" || phase === "exit" ? 1 : 0,
                y: phase === "text" || phase === "exit" ? 0 : 20
              }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-heading text-sm md:text-base tracking-[0.4em] text-primary mt-4"
            >
              THE FITNESS COLISEUM
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: phase === "text" || phase === "exit" ? 1 : 0
              }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="font-heading text-xs tracking-[0.3em] text-muted-foreground mt-3"
            >
              BUILD STRENGTH. BUILD DISCIPLINE.
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-56 h-0.5 bg-muted/50 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
