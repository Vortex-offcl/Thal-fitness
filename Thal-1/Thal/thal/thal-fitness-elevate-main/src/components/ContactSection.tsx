import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Phone, Clock, Send, Mail } from "lucide-react";
import heroGym from "@/assets/hero-gym.jpg";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    details: ["General Choudry Street, 261, 16th St", "GKM Colony, Perambur, Chennai, Tamil Nadu 600082"],
    link: "https://maps.app.goo.gl/9UXjpkgtKbXRLWuu5",
  },
  {
    icon: Phone,
    title: "Contact",
    details: ["+91 9800976976", "thalkolathur@gmail.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon-Sat: 5:00 AM - 11:00 PM", "Sunday: 6:00 AM - 9:00 PM"],
  },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [membershipData, setMembershipData] = useState({
    name: "",
    service: "Swimming",
    date: "",
    time: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create message with form data
    const message = `Hi THAL, I'm interested in a free trial.
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
${formData.message ? `Message: ${formData.message}` : ""}`;
    
    // WhatsApp API link - user will manually send from WhatsApp
    const waNumber = getWhatsAppNumber();
    const whatsappLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
    
    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const getWhatsAppNumber = () => {
    const raw = contactInfo[1].details[0] || "";
    return raw.replace(/[^0-9]/g, "");
  };

  const tomorrowISODate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const getTimeBounds = (dateStr: string) => {
    // returns { min: '08:00', max: '20:00' } depending on weekday
    if (!dateStr) return { min: "08:00", max: "20:00" };
    const d = new Date(dateStr + "T00:00:00");
    const day = d.getDay(); // 0 = Sunday
    if (day === 0) {
      return { min: "08:00", max: "18:00" };
    }
    return { min: "08:00", max: "20:00" };
  };

  const getServiceDuration = (service: string) => {
    switch (service.toLowerCase()) {
      case "swimming":
        return 60; // minutes
      case "steam bath":
      case "ice bath":
        return 20;
      default:
        return 0;
    }
  };

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const formatAMPM = (time24: string) => {
    const [hStr, mStr] = time24.split(":");
    let h = Number(hStr);
    const m = Number(mStr);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const getLatestStartMinutes = (dateStr: string, service: string) => {
    const bounds = getTimeBounds(dateStr);
    const endMin = timeToMinutes(bounds.max);
    const duration = getServiceDuration(service);
    // closing time (bounds.max) is not included — service must finish before that time
    return endMin - duration;
  };

  const generateTimeOptions = (dateStr: string, service: string) => {
    const bounds = getTimeBounds(dateStr);
    const startMin = timeToMinutes(bounds.min);
    const latestStart = getLatestStartMinutes(dateStr, service);
    if (latestStart < startMin) return [];
    const step = 10; // minutes
    const opts: { value: string; label: string }[] = [];
    for (let t = startMin; t <= latestStart; t += step) {
      const val = minutesToTime(t);
      opts.push({ value: val, label: formatAMPM(val) });
    }
    return opts;
  };

  const handleMembershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure date is at least tomorrow
    const minDate = tomorrowISODate();
    if (!membershipData.date || membershipData.date < minDate) {
      toast({ title: "Please select a date from tomorrow onwards." });
      return;
    }

    if (!membershipData.time) {
      toast({ title: "Please select a preferred time." });
      return;
    }

    // Validate time against service duration and closing time (closing is exclusive).
    const latestStart = getLatestStartMinutes(membershipData.date, membershipData.service);
    const selectedMinutes = timeToMinutes(membershipData.time);
    if (selectedMinutes > latestStart) {
      const latestLabel = formatAMPM(minutesToTime(latestStart));
      toast({ title: `Selected time is too late. Latest start for ${membershipData.service} on this day is ${latestLabel}.` });
      return;
    }

    const waNumber = getWhatsAppNumber();
    const displayTime = formatAMPM(membershipData.time);
    const message = `Membership application\nName: ${membershipData.name}\nPhone: ${membershipData.phone}\nService: ${membershipData.service}\nDate: ${membershipData.date}\nTime: ${displayTime}`;
    const link = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
    setMembershipData({ name: "", service: "Swimming", date: "", time: "", phone: "" });
  };

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroGym}
          alt="THAL Gym"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-heading tracking-[0.3em] text-sm">GET IN TOUCH</span>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mt-4">
            CONTACT US
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-8 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <a
                    href={info.link || "#"}
                    target={info.link ? "_blank" : undefined}
                    rel={info.link ? "noopener noreferrer" : undefined}
                    className="w-12 h-12 glass-card flex items-center justify-center flex-shrink-0 hover:border-primary transition-colors"
                  >
                    <info.icon className="text-primary" size={20} />
                  </a>
                  <div>
                    <h4 className="font-heading text-lg tracking-wider text-foreground mb-1">
                      {info.title}
                    </h4>
                    {info.details.map((detail) => (
                      detail && <p key={detail} className="text-muted-foreground text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card overflow-hidden rounded-lg"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6519815844644!2d80.1833!3d13.1939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52617b6b6b6b6b%3A0x6b6b6b6b6b6b6b6b!2sGKM%20Colony%2C%20Perambur%2C%20Chennai%2C%20Tamil%20Nadu%20600082!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <h3 className="font-heading text-2xl tracking-wider text-foreground mb-6">
                BOOK A FREE TRIAL
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder=""
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder=""
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder=""
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full flex items-center justify-center gap-3"
                >
                  <span>SEND VIA WHATSAPP</span>
                  <Send size={18} />
                </motion.button>
              </div>
            </form>
            {/* Membership application form */}
            <div className="mt-8">
              <div className="glass-card p-6">
                <h3 className="font-heading text-2xl tracking-wider text-foreground mb-3">Membership Applications</h3>
                <p className="text-sm text-muted-foreground mb-4">For membership customers the swimming, steam bath and ice bath are served with discount. Timings: Swimming / Ice Bath / Steam Bath — Mon-Sat: 8:00 AM - 8:00 PM, Sun: 8:00 AM - 6:00 PM. Swimming duration: 1 hour. Steam bath & Ice bath duration: 20 minutes.</p>

                <form onSubmit={handleMembershipSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={membershipData.name}
                      onChange={(e) => setMembershipData({ ...membershipData, name: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={membershipData.phone}
                      onChange={(e) => setMembershipData({ ...membershipData, phone: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">Service</label>
                    <select
                      value={membershipData.service}
                      onChange={(e) => {
                        const svc = e.target.value;
                        setMembershipData({ ...membershipData, service: svc, time: "" });
                      }}
                      className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option>Swimming</option>
                      <option>Steam Bath</option>
                      <option>Ice Bath</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">Preferred Date</label>
                      <input
                        type="date"
                        min={tomorrowISODate()}
                        value={membershipData.date}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          const latest = getLatestStartMinutes(newDate || tomorrowISODate(), membershipData.service);
                          if (membershipData.time && timeToMinutes(membershipData.time) > latest) {
                            setMembershipData({ ...membershipData, date: newDate, time: "" });
                          } else {
                            setMembershipData({ ...membershipData, date: newDate });
                          }
                        }}
                        className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-heading tracking-wider text-foreground/80 mb-2">Preferred Time</label>
                      <select
                        value={membershipData.time}
                        onChange={(e) => setMembershipData({ ...membershipData, time: e.target.value })}
                        className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                        required
                      >
                        <option value="">Select time</option>
                        {generateTimeOptions(membershipData.date || tomorrowISODate(), membershipData.service).map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">Times shown in AM/PM. Latest valid start depends on service duration.</p>
                    </div>
                  </div>

                  <div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full flex items-center justify-center gap-3"
                    >
                      <span>APPLY VIA WHATSAPP</span>
                      <Send size={18} />
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
