/**
 * Checks and sets the layoutPrecision value to an
 * extent of 0.1 to 1.
 * @param  {number} p   User defined precision value.
 * @return {number}     Set precision value.
 */
export function clampLayoutPrecision(p) {
  if (p < 0.1) { 
    console.warn("Precision value should be > 0.1 and < 1. Precision coerced to 0.1.");
    return 0.1; 
  } else if (p > 1) {
    console.warn("Precision value should be > 0.1 and < 1. Precision coerced to 1.");
    return 1;    
  }
  return p;
}
