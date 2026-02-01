import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ctaBackground from "@/assets/cta-background.jpg";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="facilities" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={ctaBackground}
          alt="THAL Gym"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="text-primary font-heading tracking-[0.3em] text-sm">TRANSFORM YOUR LIFE</span>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mt-4 mb-6 leading-tight">
            START YOUR<br />
            <span className="text-primary text-glow-subtle">TRANSFORMATION</span><br />
            TODAY
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg">
            Join THAL and become part of an elite fitness community. Premium equipment, 
            expert trainers, and an atmosphere designed for champions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              JOIN THAL NOW
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
            >
              FREE TRIAL PASS
            </motion.a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-6 mt-12">
            {[
              "No Joining Fee",
              "Personal Training",
              "Diet Consultation",
              "Premium Facilities",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="font-heading tracking-wider text-sm text-foreground/80">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
