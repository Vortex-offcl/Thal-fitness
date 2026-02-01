import { motion } from "framer-motion";
import { Instagram, Mail, MapPin } from "lucide-react";
import thalLogo from "@/assets/thal-logo.jpg";

const footerLinks = [
  { icon: Instagram, label: "Instagram", value: "@thal_kolathur", href: "https://www.instagram.com/thal_kolathur?igsh=MWt2dDZmNXowdzN6MQ==" },
  { icon: Mail, label: "Gmail", value: "thalkolathur@gmail.com", href: "mailto:thalkolathur@gmail.com" },
  { icon: MapPin, label: "Location", value: "GKM Colony, Perambur, Chennai", href: "https://maps.app.goo.gl/9UXjpkgtKbXRLWuu5" },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/60">
      <div className="container mx-auto px-6 py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={thalLogo}
              alt="THAL Logo"
              className="h-12 w-12 object-contain bg-foreground rounded"
            />
            <div>
              <h3 className="font-heading text-2xl tracking-[0.2em] text-foreground">THAL</h3>
              <p className="text-muted-foreground text-xs tracking-[0.25em]">FITNESS ELEVATE</p>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-3">
            {footerLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.label === "Instagram" || item.label === "Location" ? "_blank" : undefined}
                rel={item.label === "Instagram" || item.label === "Location" ? "noopener noreferrer" : undefined}
                whileHover={{ y: -2, scale: 1.02 }}
                className="group flex items-center gap-3 rounded-sm border border-border/70 bg-secondary/40 px-4 py-3 transition-colors duration-300 hover:border-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border/60 bg-background text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="font-heading text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{item.label}</p>
                  <p className="text-sm text-foreground">{item.value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/70 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2024 THAL – Fitness Elevate. All rights reserved.</p>
          <p className="text-primary">Premium strength & cardio machines on every floor.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
