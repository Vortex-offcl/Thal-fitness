import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Dumbbell, ActivitySquare } from "lucide-react";
import floorCardio from "@/assets/floors/floor-1/treadmill.jpeg";
import floorChest from "@/assets/floors/floor-2/flat_bench_press.jpeg";
import floorLegs from "@/assets/floors/floor-3/squat-rack.jpeg";
import floorGround from "@/assets/floors/ground/Physio_Room.jpg";
import floorFour from "@/assets/floors/floor4/training-station.jpeg";

const floors = [
  {
    id: "ground",
    level: "Ground",
    title: "Entrance & Amenities",
    description: "Reception, swimming pool and communal spaces for members and guests.",
    features: ["Swimming Pool", "Swimming", "Reception", "Physio", "Shoe Rack"],
    icon: Heart,
    image: floorGround,
  },
  {
    id: "1",
    level: "Floor 1",
    title: "Cardio Zone",
    description: "State-of-the-art cardio equipment for burning calories and building endurance.",
    features: ["Treadmills", "Cycling Machines", "Cross Trainers", "HIIT Area"],
    icon: Heart,
    image: floorCardio,
  },
  {
    id: "2",
    level: "Floor 2",
    title: "Chest & Shoulder",
    description: "Premium weight training equipment for building upper body strength.",
    features: ["Bench Press", "Shoulder Machines", "Dumbbells", "Cable Systems"],
    icon: Dumbbell,
    image: floorChest,
  },
  {
    id: "3",
    level: "Floor 3",
    title: "Leg & Back Training",
    description: "Complete lower body and back workout stations for powerful gains.",
    features: ["Squat Racks", "Deadlift Platforms", "Leg Press", "Back Machines"],
    icon: ActivitySquare,
    image: floorLegs,
  },
  {
    id: "4",
    level: "Floor 4",
    title: "CrossFit & Recovery",
    description: "CrossFit rigs, training studios and recovery spaces including therapy pools and mobility zones.",
    features: ["CrossFit Stations", "Recovery Rooms", "Therapy Pools", "Training Studios"],
    icon: Dumbbell,
    image: floorFour,
  },
];

const FloorCard = ({ floor, index }: { floor: typeof floors[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = floor.icon;

  return (
    <Link to={`/floor-${floor.id}`} className="block">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
        className="floor-card group"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
          <img
            src={floor.image}
            alt={floor.title}
            className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-primary font-heading text-sm tracking-widest">{floor.level}</span>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mt-1">{floor.title}</h3>
            </div>
            <div className="p-3 glass-card">
              <Icon className="text-primary" size={24} />
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{floor.description}</p>

          <div className="flex flex-wrap gap-2">
            {floor.features.map((feature) => (
              <span
                key={feature}
                className="text-xs font-heading tracking-wider px-3 py-1.5 bg-muted/60 rounded-full text-foreground/80"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-primary font-heading tracking-widest text-xs">
            VIEW FLOOR
            <span aria-hidden className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const FloorsSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  return (
    <section id="floors" className="section-padding relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-heading tracking-[0.3em] text-sm">EXPLORE</span>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mt-4 mb-6">
            OUR FOUR FLOORS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Four levels of premium equipment and amenities, each dialed in for a focused training goal.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => navigate(`/floor-${floor.id}`)}
                className="px-5 py-2 rounded-sm border border-border bg-secondary/60 text-foreground font-heading text-xs tracking-widest transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5"
              >
                {floor.level}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Floors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {floors.map((floor, index) => (
            <FloorCard key={floor.level} floor={floor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FloorsSection;
