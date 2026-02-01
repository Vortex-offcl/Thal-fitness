import { useMemo } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const floorMeta: Record<string, { title: string; intro: string; highlights: string[] }> = {
  "1": {
    title: "Floor 1 — Cardio & Warm-Up",
    intro: "Dedicated to high-intensity cardio with fast access to warm-up stations and monitoring screens.",
    highlights: ["Treadmills", "Spin bikes", "Cross trainers", "HIIT tracks"],
  },
  "2": {
    title: "Floor 2 — Chest & Shoulders",
    intro: "Focused upper-body strength floor with presses, cables, and isolated shoulder stations.",
    highlights: ["Bench & incline presses", "Cable cross stations", "Dumbbell zone", "Shoulder isolations"],
  },
  "3": {
    title: "Floor 3 — Legs & Back",
    intro: "Heavy-duty lower body and back training with platforms, racks, and pulldown rigs.",
    highlights: ["Squat racks", "Deadlift platforms", "Leg press & curls", "Lat pulldown rigs"],
  },
  "4": {
    title: "Floor 4 — Recovery & Training",
    intro: "Dedicated recovery and training spaces including therapy, studios and light conditioning.",
    highlights: ["Recovery Rooms", "Therapy Pools", "Training Studios", "Mobility Zones"],
  },
  "ground": {
    title: "Ground Floor — Entrance & Amenities",
    intro: "Swimming pool and communal spaces for members and guests.",
    highlights: ["Swimming Pool","cafe"],
  },
};

const floorImageGlobs: Record<string, Record<string, { default: string } | string>> = {
  "1": import.meta.glob("../assets/floors/floor-1/*.{png,jpg,jpeg,webp,svg}", { eager: true }) as Record<string, { default: string } | string>,
  "2": import.meta.glob("../assets/floors/floor-2/*.{png,jpg,jpeg,webp,svg}", { eager: true }) as Record<string, { default: string } | string>,
  "3": import.meta.glob("../assets/floors/floor-3/*.{png,jpg,jpeg,webp,svg}", { eager: true }) as Record<string, { default: string } | string>,
  "4": import.meta.glob("../assets/floors/floor4/*.{png,jpg,jpeg,webp,svg}", { eager: true }) as Record<string, { default: string } | string>,
  "ground": import.meta.glob("../assets/floors/ground/*.{png,jpg,jpeg,webp,svg}", { eager: true }) as Record<string, { default: string } | string>,
};

const useFloorImages = (floorId: string) => {
  const modules = floorImageGlobs[floorId] ?? {};
  let imgs = Object.values(modules).map((mod) => (typeof mod === "string" ? mod : mod.default));

  // For ground floor: remove cafe/lobby/locker placeholders and prefer swimming/steam images first
  if (floorId === "ground") {
    // remove cafe/lobby/locker placeholders from ground floor images, keep reception
    imgs = imgs.filter((src) => !/(cafe|lobby|locker)/i.test(src));
    imgs.sort((a, b) => {
      const sa = a.toLowerCase();
      const sb = b.toLowerCase();
      const score = (s: string) => (s.includes("swimming") ? 0 : s.includes("steam") ? 1 : 2);
      const diff = score(sa) - score(sb);
      return diff !== 0 ? diff : sa.localeCompare(sb);
    });
  }

  // For floor 4 (the top/recovery floor) hide SVG placeholders and show only real photos
  if (floorId === "4") {
    imgs = imgs.filter((src) => !src.toLowerCase().endsWith(".svg"));
  }

  return imgs;
};

const getMachineLabel = (src: string) => {
  const file = src.split("/").pop() || "";
  return file
    .replace(/\.[^.]+$/, "") // Remove file extension
    .replace(/\s+[A-Z0-9]+[a-z]*[A-Z0-9]+[a-zA-Z0-9]*(\s+[A-Z][a-z]{1,2})?$/g, "") // Remove hash patterns
    .replace(/[-_]+/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .trim() // Trim whitespace
    .replace(/\b\w/g, (c) => c.toUpperCase()) // Capitalize first letter of each word
    || "Machine";
};

const FloorPage = () => {
  const { pathname } = useLocation();
  const floorId = pathname.split("-")[1] || "";
  const floorKey = floorId;
  const meta = floorMeta[floorKey];
  const images = useMemo(() => (floorKey ? useFloorImages(floorKey) : []), [floorKey]);
  const availableModules = floorImageGlobs[floorKey] ?? {};

  if (!meta) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="bg-background min-h-screen text-foreground">
      <ScrollProgress />
      <Navbar />

      <section className="pt-28 pb-16 px-6 md:px-10 lg:px-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="font-heading tracking-[0.3em] text-xs text-primary uppercase">{meta.title}</p>
            <h1 className="mt-3 font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground">Curated Machines & Zones</h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{meta.intro}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {meta.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-heading tracking-widest text-foreground/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

            <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-sm border border-primary bg-primary text-primary-foreground px-4 py-2 text-xs font-heading tracking-[0.2em] transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5"
            >
              ← BACK HOME
            </Link>
            {["ground", "1", "2", "3", "4"].map((id) => (
              <Link
                key={id}
                to={`/floor-${id}`}
                className={`rounded-sm border px-4 py-2 text-xs font-heading tracking-[0.2em] transition-colors duration-300 ${
                  id === floorKey
                    ? "border-primary text-primary"
                    : "border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {id === "ground" ? "Ground" : `Floor ${id}`}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.length === 0 ? (
            <div className="glass-card p-8 md:col-span-2 lg:col-span-3">
              <h2 className="font-heading text-xl text-foreground">No images found for this floor</h2>
              <p className="mt-3 text-muted-foreground text-sm">Place the official photos for {meta.title} inside <strong>src/assets/floors/{floorKey === '4' ? 'floor4' : floorKey === 'ground' ? 'ground' : `floor-${floorKey}`}</strong> (JPG, PNG, WEBP, or SVG).</p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="font-medium">Debug info</p>
                <p>Requested floor key: <strong>{floorKey || '(empty)'}</strong></p>
                <p>Detected files: <strong>{Object.keys(availableModules).length}</strong></p>
                <ul className="mt-2 list-disc list-inside text-xs">
                  {Object.keys(availableModules).map((k) => (
                    <li key={k} className="truncate max-w-xl">{k}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            images.map((src) => (
              <figure key={src} className="relative overflow-hidden rounded-lg border border-border/60 bg-secondary/60">
                <div className="group block h-64 w-full overflow-hidden">
                  <img
                    src={src}
                    alt={getMachineLabel(src)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <figcaption className="flex items-center justify-between px-4 py-3">
                  <span className="font-heading text-sm tracking-widest text-foreground">{getMachineLabel(src)}</span>
                  <span className="text-[10px] font-heading tracking-[0.2em] text-primary">FLOOR {floorKey}</span>
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FloorPage;
