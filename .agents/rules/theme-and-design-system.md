# Theme Consistency & Design System Rules

## Purpose
Ensure all pages and components maintain a unified, premium visual aesthetic and color theme across light and dark modes.

## Core Rules

1. **Theme Tokens**:
   - Backgrounds: `bg-slate-50` (light) / `dark:bg-slate-950` (dark).
   - Surfaces/Cards: `bg-white border-slate-200` (light) / `dark:bg-slate-900 dark:border-slate-800` (dark).
   - Brand Accent: `text-blue-600` / `bg-blue-600` / `dark:text-blue-400`.
   - Typography: Inter (Sans) and JetBrains Mono (Monospace).

2. **Mandatory Page Components**:
   - **Anti-FOUC script**: Placed in `<head>` before rendering.
   - **Header**: Glassmorphism navbar with avatar, brand name, subtitle, theme toggle (`sun-icon`/`moon-icon`), Medium, and GitHub links.
   - **Footer**: Standard 3-column layout with author info, dynamic year (`#current-year`), and navigation links.
   - **Favicon**: Shield icon `🛡️` across all pages.
   - **Container**: `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`.

3. **Theme Reactivity**:
   - Maintain the `themeChanged` event for diagrams and interactive elements.
   - Store theme selection in `localStorage` under key `'theme'`.

See `AGENTS.md` at the workspace root for the complete specification.
