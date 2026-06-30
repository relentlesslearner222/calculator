# Runbook: Scientific Calculator

## Overview

Standalone React 18 + TypeScript + Tailwind CSS scientific calculator desktop application.
No backend. Runs entirely in the browser. Deployed as a static site.

## Repository

`relentlesslearner222/calculator`

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Build | Vite 5 |
| Tests | Vitest + Testing Library |

## Environment Variables

None required. This is a fully static frontend application with no server-side
components and no external API calls.

## Running Locally

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev
# → http://localhost:5173

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Production build
npm run build
# Outputs to dist/

# Preview production build locally
npm run preview
# → http://localhost:4173
```

## Deployment

The `dist/` directory after `npm run build` is a self-contained static site.
Deploy to any static host (S3+CloudFront, GitHub Pages, Netlify, Vercel).

Typical S3+CloudFront deployment:
```bash
npm run build
aws s3 sync dist/ s3://<BUCKET_NAME>/ --delete
# Invalidate CloudFront if needed
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Feature Summary

| Feature | Details |
|---------|---------|
| Basic arithmetic | +, −, ×, ÷ |
| Power | xⁿ, x² |
| Scientific | sin, cos, tan, asin, acos, atan, log, ln, √, 10ˣ, eˣ |
| Constants | π, e |
| Angle mode | DEG / RAD toggle |
| Memory | MC, MR, M+, M−, MS |
| History | Last 20 calculations, clickable to restore |
| Keyboard | Full keyboard support |
| Theme | Dark / Light toggle (persisted to localStorage) |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9`, `.` | Digit input |
| `+` `-` `*` `/` | Arithmetic operators |
| `^` | Power operator |
| `Enter` or `=` | Evaluate expression |
| `Escape` | Clear all (AC) |
| `Backspace` | Delete last character |
| `(` `)` | Parentheses |

## Failure Modes

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| `Syntax error` on display | Malformed expression | Check balanced parentheses; press AC to reset |
| `Division by zero` | Divisor evaluates to 0 | Check expression |
| `Result is NaN` | Domain error (e.g. sqrt of negative) | Check argument |
| App blank on load | Build issue / JS error | Check browser console; run `npm run build` fresh |
| Tests failing | Dependency mismatch | Run `npm install` then `npm test` |

## File Layout

```
src/
  components/
    Calculator.tsx       Root shell
    Display.tsx          Expression + result display
    ButtonGrid.tsx       Full button layout
    HistoryPanel.tsx     Collapsible calculation history
    CalcButton.tsx       Individual button with variant styles
  hooks/
    useCalculator.ts     All calculator state (useReducer)
    useKeyboard.ts       Keyboard event binding
    useTheme.ts          Dark/light theme + localStorage
  utils/
    evaluate.ts          Safe expression evaluator
    format.ts            Number and expression formatting
  types/
    calculator.ts        Shared TypeScript types
  __tests__/
    evaluate.test.ts
    useCalculator.test.ts
    format.test.ts
main.tsx                 App entry point
index.html               HTML shell
docs/runbooks/
  calculator.md          This file
```
