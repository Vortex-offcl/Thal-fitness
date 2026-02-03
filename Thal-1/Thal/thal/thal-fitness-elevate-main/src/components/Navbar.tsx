import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import thalLogo from "@/assets/thal-logo.jpg";

const navLinks: Array<{ name: string; href?: string; children?: { name: string; href: string }[] }> = [
  { name: "Home", href: "#home" },
  {
    name: "Floors",
    href: "#floors",
    children: [
      { name: "Ground", href: "/floor-ground" },
      { name: "Floor 1", href: "/floor-1" },
      { name: "Floor 2", href: "/floor-2" },
      { name: "Floor 3", href: "/floor-3" },
      { name: "Floor 4", href: "/floor-4" },
    ],
  },
  { name: "Facilities", href: "#facilities" },
  { name: "Contact", href: "#contact" },
];

const enquiryHref = "https://wa.me/919800976976";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // If the href is a route (starts with '/'), navigate directly
    if (href.startsWith("/")) {
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }

    // Otherwise treat as an in-page anchor; ensure on homepage then scroll
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={thalLogo}
                alt="THAL Logo"
                className="h-12 w-12 object-contain bg-foreground rounded"
              />
              <span className="font-heading text-2xl font-bold tracking-wider text-foreground">
                THAL
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {!link.children ? (
                    <motion.a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href || "")}
                      className="relative font-heading text-sm tracking-widest text-foreground/80 hover:text-primary transition-colors duration-300 group"
                      whileHover={{ y: -2 }}
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </motion.a>
                  ) : (
                    <div className="group">
                      <motion.button
                        onClick={(e) => handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, link.href || "")}
                        className="relative font-heading text-sm tracking-widest text-foreground/80 hover:text-primary transition-colors duration-300"
                        whileHover={{ y: -2 }}
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                      </motion.button>

                      <div className="absolute left-0 mt-2 w-48 rounded-md border border-border/60 bg-background/95 py-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 shadow-lg">
                        {link.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            onClick={(e) => handleNavClick(e, child.href)}
                            className="block px-4 py-2 text-sm text-foreground/90 hover:bg-secondary/60"
                          >
                            {child.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <motion.a
                href="#contact"
                className="btn-primary text-sm py-3 px-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                JOIN NOW
              </motion.a>
              <motion.a
                href={enquiryHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-sm bg-primary text-primary-foreground text-sm font-heading tracking-widest py-3 px-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ENQUIRY
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-background z-40 pt-24 px-6"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <div key={link.name}>
                  {!link.children ? (
                    <motion.a
                      href={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="font-heading text-2xl tracking-wider text-foreground hover:text-primary transition-colors"
                      onClick={(e) => handleNavClick(e, link.href || "")}
                    >
                      {link.name}
                    </motion.a>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="font-heading text-2xl text-foreground">{link.name}</div>
                      {link.children.map((child, cIdx) => (
                        <motion.a
                          key={child.name}
                          href={child.href}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index + cIdx) * 0.05 }}
                          className="font-heading text-lg tracking-wider text-foreground/80 hover:text-primary transition-colors"
                          onClick={(e) => handleNavClick(e, child.href)}
                        >
                          {child.name}
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="btn-primary text-center mt-4"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                JOIN NOW
              </motion.a>
              <motion.a
                href={enquiryHref}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-2 inline-flex items-center justify-center rounded-sm bg-primary text-primary-foreground font-heading tracking-widest py-3 px-5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ENQUIRY
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
