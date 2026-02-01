// Quick test for getMachineLabel logic
const getMachineLabel = (src) => {
  const file = src.split("/").pop() || "";
  let name = file.replace(/\.[^.]+$/, "");

  // Try to split camelCase and separate letters/digits
  name = name.replace(/([a-z0-9])([A-Z]+)/g, "$1 $2");
  name = name.replace(/([A-Za-z])([0-9])/g, "$1 $2");
  name = name.replace(/([0-9])([A-Za-z])/g, "$1 $2");
  name = name.replace(/[-_]+/g, " ").trim();

  const isJunk = (t) => {
    const s = t.replace(/[^A-Za-z0-9]/g, "");
    if (s.length === 0) return true;
    if (/^[0-9]+$/.test(s)) return true; // any numeric token is junk
    // Short uppercase tokens (1-3 chars) like IMG, CY, V likely non-descriptive IDs
    if (/^[A-Z]{1,3}$/.test(s)) return true;
    // Mixed alphanumeric tokens (e.g. CYC7CGX1, AB12CD3) are junk when reasonably long
    if (/[A-Za-z]/.test(s) && /\d/.test(s) && s.length >= 4) return true;
    // Sequences with multiple uppercase letters and mixed case are suspicious
    if (/[A-Z].*[A-Z]/.test(s) && s.length >= 3) return true;
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
  'assets/floors/floor-1/Squat_Rack.jpg',
  // Add tricky cases
  'assets/floors/floor-1/FunctionalEquipmentCYC7CGX1.jpg',
  'assets/floors/floor-1/functionalEquipmentCYc7CGX1.png',
  'assets/floors/floor-1/benchpress_v2_202301.jpg'
];

for (const s of samples) {
  if (s.includes('Functional Equipment') || s.includes('PLATE') || s.includes('Weighted') || s.includes('Rowing')) {
    console.log('--- DEBUG:', s);
    const file = s.split('/').pop() || '';
    const fileNoExt = file.replace(/\.[^.]+$/, '');
    console.log('  file:', file);
    console.log('  label:', getMachineLabel(s));
  }
  console.log(s, '->', getMachineLabel(s));
}