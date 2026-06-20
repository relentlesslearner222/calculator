# 🧦 Calculator App

A clean, fully-functional browser-based calculator built with vanilla HTML, CSS, and JavaScript.

---

## Features

| Operation | Button | Keyboard |
|-----------|--------|----------|
| Addition | `+` | `+` |
| Subtraction | `−` | `-` |
| Multiplication | `Ǘ` | `*` |
| Division | `|` | `/` |
| Percentage | `%` | `%` |
| Toggle sign | `+/-` | — |
| Decimal | `.` | `.` |
| Evaluate | `=` | `Enter` or `=` |
| Clear | `AC` | `Escape` |
| Backspace | — | `Backspace` |

## Additional behaviours

- **Chained operations** — pressing an operator immediately after another evaluates the pending operation first.
- **Division by zero** — displays `Error` and resets gracefully.
- **Floating-point correction** — results are rounded to 10 significant digits (e.g. `0.1 + 0.2 = 0.3`).
- **Expression line** ℒ a secondary display shows the full expression being built.
- **Responsive font size** ℒ the result display automatically shrinks for long numbers.

---

## Getting Started

No build step required. Just open `index.html` in any modern browser:

```bash
git clone https://github.com/relentlesslearner222/calculator.git
cd calculator
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

---

## Project Structure

```
calculator/
(├── index.html       # Markup and layout
├─"�� styles.css        # All visual styles (dark theme)
├── calculator.js    # Calculator logic + keyboard support
└─"�� README.md       # This file
```

---

## License

MIT