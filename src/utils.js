export function clampLayoutPrecision(p) {
  if (p < 0.1) { 
    console.warn("Precision value should be > 0.1 and < 1, Coerced to 0.1.");
    return 0.1; 
  } else if (p > 1) {
    console.warn("Precision value should be > 0.1 and < 1, Coerced to 1.");
    return 1;    
  }
  return p;
}