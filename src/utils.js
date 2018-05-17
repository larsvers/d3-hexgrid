export function clampPrecision(p) {
  if (p < 0) { 
    console.warn("You've set a negative precision value, " +
      "which got coerced to 0.1. Consider a value between 0.3 and 1.");
    return 0.1; 
  }
  return p;
}