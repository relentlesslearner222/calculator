const DEG_TO_RAD = Math.PI / 180;

export function sinFn(x, angleUnit) {
  const v = angleUnit === 'deg' ? x * DEG_TO_RAD : x;
  return Math.sin(v);
}

export function cosFn(x, angleUnit) {
  const v = angleUnit === 'deg' ? x * DEG_TO_RAD : x;
  return Math.cos(v);
}

export function tanFn(x, angleUnit) {
  const v = angleUnit === 'deg' ? x * DEG_TO_RAD : x;
  return Math.tan(v);
}

export function asinFn(x, angleUnit) {
  const r = Math.asin(x);
  return angleUnit === 'deg' ? r / DEG_TO_RAD : r;
}

export function acosFn(x, angleUnit) {
  const r = Math.acos(x);
  return angleUnit === 'deg' ? r / DEG_TO_RAD : r;
}

export function atanFn(x, angleUnit) {
  const r = Math.atan(x);
  return angleUnit === 'deg' ? r / DEG_TO_RAD : r;
}

export function logFn(x) {
  if (x <= 0) return NaN;
  return Math.log10(x);
}

export function lnFn(x) {
  if (x <= 0) return NaN;
  return Math.log(x);
}

export function sqrtFn(x) {
  if (x < 0) return NaN;
  return Math.sqrt(x);
}

export function absFn(x) {
  return Math.abs(x);
}

export function expFn(x) {
  return Math.exp(x);
}

export function factFn(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function applyFunc(name, x, angleUnit = 'deg') {
  switch (name) {
    case 'sin': return sinFn(x, angleUnit);
    case 'cos': return cosFn(x, angleUnit);
    case 'tan': return tanFn(x, angleUnit);
    case 'asin': return asinFn(x, angleUnit);
    case 'acos': return acosFn(x, angleUnit);
    case 'atan': return atanFn(x, angleUnit);
    case 'log': return logFn(x);
    case 'ln': return lnFn(x);
    case 'sqrt': return sqrtFn(x);
    case 'abs': return absFn(x);
    case 'exp': return expFn(x);
    case 'fact': return factFn(x);
    default: return NaN;
  }
}
