import { motion, AnimatePresence, Easing } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import heroGym from "@/assets/hero-gym.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import heroSlide4 from "@/assets/hero-slide-4.jpg";
import heroSlide5 from "@/assets/hero-slide-5.jpg";

const heroImages = [heroGym, heroSlide2, heroSlide3, heroSlide4, heroSlide5];

const HeroSection = () => {
  const brandName = "THAL";
  const tagline = "Build Strength. Build Discipline.";
  const [currentSlide, setCurrentSlide] = useState(0);

  const easeOut: Easing = [0.215, 0.61, 0.355, 1];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <img
              src={heroImages[currentSlide]}
              alt={`THAL Gym Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 overlay-hero z-10" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        {/* Animated Brand Name */}
        <div className="flex justify-center items-center mb-6 perspective-1000">
          {brandName.split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.5 + i * 0.15,
                duration: 0.6,
                ease: easeOut,
              }}
              className="font-heading text-7xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-bold text-foreground text-glow inline-block"
              style={{ transformStyle: "preserve-3d" }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
          className="font-heading text-xl sm:text-2xl md:text-3xl tracking-[0.3em] text-foreground/90 mb-4"
        >
          {tagline}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="font-heading text-sm sm:text-base tracking-[0.5em] text-primary mb-12"
        >
          THE FITNESS COLISEUM
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary min-w-[200px]"
          >
            JOIN NOW
          </motion.a>
          <motion.a
            href="#floors"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline min-w-[200px]"
          >
            EXPLORE GYM
          </motion.a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-xs tracking-widest text-foreground/50 font-heading">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-primary" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
