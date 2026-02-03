const isJunk = (t) => {
  const s = t.replace(/[^A-Za-z0-9]/g, "");
  console.log('s:', s);
  console.log('len===0', s.length === 0);
  console.log('all digits', /^[0-9]+$/.test(s));
  console.log('len===1', s.length === 1);
  console.log('up1-3', /^[A-Z]{1,3}$/.test(s));
  console.log('mixed alnum', /[A-Za-z]/.test(s) && /\d/.test(s) && s.length >= 4);
  console.log('mixedUpper & contains lower/digit', /[A-Z].*[A-Z]/.test(s), /[a-z0-9]/.test(s), s.length >= 3);
  console.log('long numeric', /^[0-9]{3,}$/.test(s));
  console.log('slen<3', s.length < 3);
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

['LOADER','PLATE','Functional','Equipment'].forEach(x => {
  console.log('===', x, '->', isJunk(x));
});