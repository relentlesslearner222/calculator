# Salesforce Calculator App

A fully-featured calculator web app styled with the **Salesforce Lightning Design System (SLDS)**.

---

## Features

- Arithmetic Operations: Addition, Subtraction, Multiplication, Division
- Utility Functions: AC (all-clear), Toggle Sign (+/-), Percentage (%)
- Decimal Support
- Chained Calculations
- Persistent Calculation History (localStorage)
- Keyboard Support (0-9, +, -, *, /, Enter, Escape, Backspace, %)
- Toast Notifications
- Responsive Layout
- Error Handling (division by zero)

---

## Getting Started

No build step required -- pure HTML, CS, and vanilla JavaScript.

```bash
git clone https://github.com/relentlesslearner222/calculator.git
cd calculator
open index.html
```

---

## File Structure

```
calculator/
   index.html   # App shell and button layout
   styles.css   # SLDS-themed design tokens and styles
   app.js       # Calculator logic, history, keyboard
   README.md    # This file
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| 0-9 | Input digit |
| . | Decimal point |
| + - * / | Operator |
| Enter or = | Evaluate |
| Escape or C | All Clear |
| Backspace | Delete last digit |
| % | Percentage |

---

*Built with Salesforce Lightning Design System*