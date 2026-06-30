# Scientific Calculator

A desktop-grade scientific calculator web application built with React 18, TypeScript, and Tailwind CSS.

## Features

- **Basic arithmetic**: addition, subtraction, multiplication, division
- **Scientific functions**: sin, cos, tan, asin, acos, atan (deg/rad modes), log, ln, √, x², xⁿ, 10^x, e^x
- **Constants**: π, e
- **Memory operations**: MC, MR, M+, M−
- **Parentheses** for grouped expressions
- **Calculation history** — last 20 entries, clickable to restore
- **Keyboard support** — full numeric and operator keys
- **Dark / Light theme toggle**
- **Error handling** — domain errors (√ of negative, log of ≤0, div by zero) shown inline

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
npm test           # run unit tests
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 0–9, . | Digit / decimal |
| +, -, *, / | Operators |
| Enter or = | Evaluate |
| Backspace | Delete last char |
| Escape | Clear all |
| (, ) | Parentheses |

## Project Layout

```
src/
  components/
    Calculator.tsx        — root shell, keyboard handler, theme toggle
    Display.tsx           — expression + result display
    ButtonGrid.tsx        — button layout (basic + scientific)
    HistoryPanel.tsx      — collapsible calculation history
    CalcButton.tsx        — individual button with variant styles
  hooks/
    useCalculator.ts      — all calculator state and logic
    useKeyboard.ts        — keyboard event binding
    useTheme.ts           — dark/light theme persistence
  utils/
    evaluate.ts           — safe expression evaluator
    format.ts             — number formatting helpers
  types/
    calculator.ts         — shared TypeScript types
  __tests__/
    evaluate.test.ts      — unit tests for evaluator
    useCalculator.test.ts — hook unit tests
main.tsx                  — app entry point
index.html                — HTML shell
```

## Runbook

See [docs/runbooks/calculator.md](docs/runbooks/calculator.md).
