// Quick test for getMachineLabel logic
const getMachineLabel = (src) => {
  const file = src.split("/").pop() || "";
  let name = file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();

  const isJunk = (t) => {
    const s = t.replace(/[^A-Za-z0-9]/g, "");
    if (s.length < 3) return false; // keep short words
    // Mixed alphanumeric tokens (e.g. CYC7CGX1, AB12CD3) are junk when reasonably long
    if (/[A-Za-z]/.test(s) && /\d/.test(s) && s.length >= 4) return true;
    // Long numeric sequences like 12345
    if (/^[0-9]{3,}$/.test(s)) return true;
    // Short uppercase abbreviations (1-2 chars) likely non-descriptive IDs
    if (/^[A-Z]{1,2}$/.test(s)) return true;
    return false;
  };

  const tokens = name.split(/\s+/);
  let cleaned = tokens.slice();
  while (cleaned.length > 1 && isJunk(cleaned[cleaned.length - 1])) {
    cleaned.pop();
  }

  const out = cleaned.join(" ").replace(/\s+/g, " ").trim();
  if (!out) return "Machine";
  // If the remaining label is purely numeric, fallback to a generic label
  if (/^[0-9]+$/.test(out)) return "Machine";
  return out.replace(/\b\w/g, (c) => c.toUpperCase());
};

const samples = [
  'assets/floors/floor-1/Functional Equipment CYC7CGX1.jpg',
  'assets/floors/floor-1/functional-equipment-CYC7CGX1.png',
  'assets/floors/floor-1/Rowing_Machine_IMG1234.webp',
  'assets/floors/floor-1/treadmill-12345.jpg',
  'assets/floors/floor-1/elliptical-machine.jpg',
  'assets/floors/floor-1/Weighted-Bench-AB12CD3.jpg',
  'assets/floors/floor-1/PLATE-LOADER-112233.png',
  'assets/floors/floor-1/123456.jpg',
  'assets/floors/floor-1/Squat_Rack.jpg'
];

for (const s of samples) {
  console.log(s, '->', getMachineLabel(s));
}