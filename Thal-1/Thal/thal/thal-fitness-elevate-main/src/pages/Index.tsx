import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FloorsSection from "@/components/FloorsSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash if it hasn't been shown in this session
    return !sessionStorage.getItem("splashShown");
  });

  useEffect(() => {
    if (showSplash) {
      // Mark splash as shown for this session
      sessionStorage.setItem("splashShown", "true");
    }
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <main className={`bg-background min-h-screen overflow-x-hidden ${showSplash ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        <ScrollProgress />
        <Navbar />
        <HeroSection />
        <StatsSection />
        <FloorsSection />
        <CTASection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
