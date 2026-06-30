# Scientific Calculator — Runbook

## Overview

A React 18 + TypeScript scientific calculator SPA. Supports arithmetic, trig functions, logarithms, factorial, constants (π, e), memory operations, and keyboard input. Built with Vite + Tailwind CSS.

## Repository

`relentlesslearner222/calculator`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Testing | Jest 29 + React Testing Library |

## Local Development

### Prerequisites

- Node.js 20+
- npm 9+

### Setup

```bash
git clone https://github.com/relentlesslearner222/calculator.git
cd calculator
npm install
```

### Run dev server

```bash
npm start
# Opens http://localhost:5173
```

### Build for production

```bash
npm run build
# Output in dist/
```

### Run tests

```bash
npm test
# or with coverage:
npm test -- --coverage
```

### Type-check

```bash
npm run typecheck
```

## Architecture

```
src/
  App.tsx                  — Root component
  main.tsx                 — React entry point
  index.css                — Tailwind base styles
  types/
    calculator.ts          — Shared TypeScript types
  utils/
    mathEngine.ts          — Pure math: recursive-descent parser + function evaluator
  hooks/
    useCalculator.ts       — useReducer-based state machine for calculator logic
  components/
    Calculator.tsx          — Top-level layout + keyboard listener
    Display.tsx             — Expression + result display with angle/memory indicators
    CalcButton.tsx          — Reusable button with variant styling
  __tests__/
    mathEngine.test.ts      — Unit tests for math engine
    useCalculator.test.tsx  — Hook tests (renderHook)
    Display.test.tsx        — Component rendering tests
    CalcButton.test.tsx     — Component interaction tests
```

## Supported Operations

| Category | Operations |
|----------|------------|
| Arithmetic | `+` `-` `*` `/` |
| Power | `^` (xʸ) |
| Trig | `sin` `cos` `tan` `asin` `acos` `atan` |
| Logarithm | `log` (log₁₀) `ln` (natural log) |
| Other | `sqrt` `x!` (factorial) `%` `±` |
| Constants | `π` `e` |
| Memory | `MS` `MR` `M+` `MC` |
| Angle mode | `DEG` / `RAD` toggle |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Digit input |
| `.` | Decimal point |
| `+ - * /` | Operators |
| `^` | Power |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last character |
| `Escape` | Clear |
| `%` | Percent |

## Failure Modes

| Scenario | Behaviour |
|----------|-----------|
| Division by zero | Display shows `Division by zero` in red; next key press resets |
| `sqrt(-1)` | Display shows `Square root of negative number` |
| `log(0)` | Display shows `Logarithm of non-positive number` |
| `171!` | Display shows `Factorial overflow` |
| Unbalanced parentheses | Display shows `Missing closing parenthesis` |
| Unknown character | Display shows parser error with position |

## No Environment Variables

This is a pure front-end SPA — no server, no env vars required.

## Deployment

Deploy `dist/` to any static host (S3 + CloudFront, Vercel, Netlify, GitHub Pages). No server-side component.

## Team

Owner: **eng-tools-team** — `#eng-tools-team` on Slack
