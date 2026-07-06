const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export function sinDeg(x) { return Math.sin(x * DEG_TO_RAD); }
export function cosDeg(x) { return Math.cos(x * DEG_TO_RAD); }
export function tanDeg(x) { return Math.tan(x * DEG_TO_RAD); }
export function asinDeg(x) { return Math.asin(x) * RAD_TO_DEG; }
export function acosDeg(x) { return Math.acos(x) * RAD_TO_DEG; }
export function atanDeg(x) { return Math.atan(x) * RAD_TO_DEG; }

export function sinRad(x) { return Math.sin(x); }
export function cosRad(x) { return Math.cos(x); }
export function tanRad(x) { return Math.tan(x); }
export function asinRad(x) { return Math.asin(x); }
export function acosRad(x) { return Math.acos(x); }
export function atanRad(x) { return Math.atan(x); }

export function log10(x) {
  if (x <= 0) return NaN;
  return Math.log10(x);
}

export function ln(x) {
  if (x <= 0) return NaN;
  return Math.log(x);
}

export function sqrt(x) {
  if (x < 0) return NaN;
  return Math.sqrt(x);
}

export function square(x) { return x * x; }

export function exp(x) { return Math.exp(x); }

export function abs(x) { return Math.abs(x); }

export function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
