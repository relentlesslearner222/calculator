function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function power(base, exponent) {
  if (exponent < 0) return 1 / (base ** Math.abs(exponent));
  return base ** exponent;
}
module.exports = { add, subtract, power };
