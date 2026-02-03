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
    title: "Floor 3 — Leg & Back Training",
    intro: "Heavy-duty lower body and back training with platforms, racks, and pulldown rigs.",
    highlights: ["Squat racks", "Deadlift platforms", "Leg press & curls", "Lat pulldown rigs"],
  },
  "4": {
    title: "Floor 4 — CrossFit & Recovery",
    intro: "CrossFit rigs and recovery spaces including therapy pools, mobility zones and training studios.",
    highlights: ["CrossFit Stations", "Training Studios", "Recovery Rooms", "Therapy Pools"],
  },
  "ground": {
    title: "Ground Floor — Entrance & Amenities",
    intro: "Swimming pool and communal spaces for members and guests.",
    highlights: ["Swimming","Swimming Pool","Cafe"],
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
  // Return objects containing both the served src (hashed in production)
  // and the original filename (from the import key) so labels derive from
  // the original filename, not the hashed asset name.
  let imgs = Object.entries(modules).map(([key, mod]) => {
    const src = typeof mod === "string" ? mod : mod.default;
    const file = (key.split("/").pop() || "").replace(/\.[^.]+$/, "");
    return { src, file };
  });

  // For ground floor: remove cafe/lobby/locker placeholders and prefer swimming/steam images first
  if (floorId === "ground") {
    // remove cafe/lobby/locker placeholders from ground floor images, keep reception
    imgs = imgs.filter(({ src }) => !/(cafe|lobby|locker)/i.test(src));
    imgs.sort((a, b) => {
      const sa = a.src.toLowerCase();
      const sb = b.src.toLowerCase();
      const score = (s: string) => (s.includes("swimming") ? 0 : s.includes("steam") ? 1 : 2);
      const diff = score(sa) - score(sb);
      return diff !== 0 ? diff : sa.localeCompare(sb);
    });
  }

  // For floor 4 (the top/recovery floor) hide SVG placeholders and show only real photos
  if (floorId === "4") {
    imgs = imgs.filter(({ src }) => !src.toLowerCase().endsWith(".svg"));
  }

  return imgs;
};

const getMachineLabel = (src: string) => {
  const file = src.split("/").pop() || "";
  // base name without extension
  let name = file.replace(/\.[^.]+$/, "");

  // Trim common bundler hashes and version/timestamp suffixes which get appended
  // to filenames during the build (e.g. '-YxnvYiEa' or '_v2_202301'). This ensures
  // labels are derived from the original human-friendly filename.
  name = name.replace(/-[A-Za-z0-9]{6,}$/g, ""); // trailing -HASH
  name = name.replace(/_v?\d{2,}(_\d+)?$/i, ""); // _v2, _202301, _v2_202301
  name = name.replace(/_\d{6,}$/g, ""); // _202301
  name = name.replace(/[-_]+$/g, ""); // trim trailing separators

  // Try to split camelCase and separate letters/digits (e.g. FunctionalEquipment -> Functional Equipment, Treadmill123 -> Treadmill 123)
  name = name.replace(/([a-z0-9])([A-Z]+)/g, "$1 $2");
  name = name.replace(/([A-Za-z])([0-9])/g, "$1 $2");
  name = name.replace(/([0-9])([A-Za-z])/g, "$1 $2");
  // Normalize separators
  name = name.replace(/[-_]+/g, " ").trim();

  // Determine if a token looks like junk (hash-like or id-like)
  const isJunk = (t: string) => {
    const s = t.replace(/[^A-Za-z0-9]/g, "");
    if (s.length === 0) return true;
    if (/^[0-9]+$/.test(s)) return true; // any numeric token is junk
    // Single character tokens are likely non-descriptive
    if (s.length === 1) return true;
    // Short uppercase tokens (1-3 chars) like IMG, CY likely non-descriptive IDs
    if (/^[A-Z]{1,3}$/.test(s)) return true;
    // Mixed alphanumeric tokens (e.g. CYC7CGX1, AB12CD3) are junk when reasonably long
    if (/[A-Za-z]/.test(s) && /\d/.test(s) && s.length >= 4) return true;
    // Mixed-case tokens with multiple uppercase letters but containing lowercase/digits are suspicious
    if (/[A-Z].*[A-Z]/.test(s) && /[a-z0-9]/.test(s) && s.length >= 3) return true;
    // Long numeric sequences like 12345
    if (/^[0-9]{3,}$/.test(s)) return true;
    if (s.length < 3) return false; // keep small lowercase words like 'kg', 'xl'
    return false;
  };

  // Strip trailing attached junk fragments like 'NameCYC7CGX1' or 'name-12345'
  let prev;
  do {
    prev = name;
    const m = name.match(/(?:\s|-|_)?([A-Za-z0-9]{3,})$/);
    if (m && isJunk(m[1])) {
      name = name.slice(0, m.index).trim();
    }
  } while (name !== prev && name.length > 0);

  // Split into tokens and remove trailing groups that together look like junk (e.g. 'CYC 7 CGX 1')
  let tokens = name.split(/\s+/).filter(Boolean);
  let removed = true;
  while (removed && tokens.length > 1) {
    removed = false;
    for (let take = 1; take <= Math.min(5, tokens.length); take++) {
      const tail = tokens.slice(tokens.length - take).join("");
      // Only strip joined tails when they contain digits or are UPPERCASE-like hashes
      if (isJunk(tail) && (/[0-9]/.test(tail) || /^[A-Z0-9]+$/.test(tail))) {
        tokens.splice(tokens.length - take, take);
        removed = true;
        break;
      }
    }
  }

  // Filter out any remaining junk tokens anywhere in the name
  tokens = tokens.filter((t) => !isJunk(t));

  const out = tokens.join(" ").replace(/\s+/g, " ").trim();
  if (!out) return "Machine";
  // If the remaining label is purely numeric, fallback to a generic label
  if (/^[0-9]+$/.test(out)) return "Machine";
  return out.replace(/\b\w/g, (c) => c.toUpperCase());
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
            images.map(({ src, file }) => (
              <figure key={src} className="relative overflow-hidden rounded-lg border border-border/60 bg-secondary/60">
                <div className="group block h-64 w-full overflow-hidden">
                  <img
                    src={src}
                    alt={getMachineLabel(file || src)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <figcaption className="flex items-center justify-between px-4 py-3">
                  <span className="font-heading text-sm tracking-widest text-foreground">{getMachineLabel(file || src)}</span>
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
