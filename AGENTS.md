# Universal Agent Guidelines & Design System

This file serves as the single source of truth for all AI agents and developers working on this repository (**Pascal Riester's Microsoft Entra ID & Cloud Security Blog**).

The project is built with **Astro (SSG)** and **Tailwind CSS**. All agents must strictly adhere to the design system, Astro layout conventions, and theming rules outlined below when modifying existing pages or creating new components and articles.

---

## 🎨 1. Theme Architecture & Color System

The blog uses a curated **Slate & Brand Blue** aesthetic with support for **Light** and **Dark** modes.

### 1.1 Color Tokens

| Element | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Page Background** | `bg-slate-50` (`#f8fafc`) | `dark:bg-slate-950` (`#020617`) |
| **Card / Surface** | `bg-white` (`#ffffff`) | `dark:bg-slate-900` (`#0f172a`) |
| **Subtle Card / Inset** | `bg-slate-100` (`#f1f5f9`) | `dark:bg-slate-800` (`#1e293b`) |
| **Border (Primary)** | `border-slate-200` (`#e2e8f0`) | `dark:border-slate-800` (`#1e293b`) |
| **Border (Subtle/Divider)**| `border-slate-100` (`#f1f5f9`) | `dark:border-slate-800/80` |
| **Text Primary (Headings)**| `text-slate-900` (`#0f172a`) | `dark:text-white` (`#ffffff`) |
| **Text Body** | `text-slate-700` (`#334155`) | `dark:text-slate-300` (`#cbd5e1`) |
| **Text Muted / Metadata** | `text-slate-500` (`#64748b`) | `dark:text-slate-400` (`#94a3b8`) |
| **Brand Accent** | `text-blue-600` / `bg-blue-600` (`#2563eb`) | `dark:text-blue-400` (`#60a5fa`) |
| **Brand Subtle Badge** | `bg-blue-50 text-blue-700 border-blue-200` | `dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800` |
| **Code Block Background** | `bg-slate-900` (`#0f172a`) | `bg-slate-900` (`#0f172a`) |

### 1.2 Tailwind Configuration
Configured in `tailwind.config.mjs` with `darkMode: 'class'`:
```javascript
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### 1.3 Anti-FOUC (Flash of Unstyled Content) Script
To prevent a bright white flash when a user with dark mode loads any page, the following inline script is included in the `<head>` of `src/layouts/BaseLayout.astro`:

```html
<script is:inline>
  if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
</script>
```

### 1.4 Theme Switcher & Event Reactivity
- The theme state is toggled via `.dark` on `document.documentElement` and persisted in `localStorage.setItem('theme', 'dark' | 'light')`.
- Toggling the theme fires a custom `window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }))` event so that interactive elements (like Mermaid diagrams) re-render in the matching theme palette automatically.

---

## 🔤 2. Typography & Fonts

All pages import `src/styles/custom.css` which provides:
- **Sans-serif (Headings, Body, UI)**: `'Inter', system-ui, -apple-system, sans-serif`
- **Monospace (Code, Terminal, Tags)**: `'JetBrains Mono', monospace`

---

## 🛡️ 3. Brand Identity & Global Assets

- **Author**: Pascal Riester
- **Author Role / Subtitle**: Identity & Access Administrator • Microsoft Entra ID • Cloud Security Architect
- **Favicon**: Standard `/favicon.svg` and SVG data URI shield `🛡️`.
- **Author Avatar URL**: `/assets/img/pascal-riester.png`
- **Avatar Fallback**: SVG with initials "PR" on background `#2563eb`.
- **Medium Profile**: `https://medium.com/@riesterpascal`
- **GitHub Profile**: `https://github.com/cloudbypascal`
- **RSS Feed**: `/rss.xml` (auto-generated)
- **Sitemap**: `/sitemap.xml` (auto-generated)

---

## 📐 4. Astro Project Anatomy

The site is built with Astro Static Site Generation (SSG):

### 4.1 Layouts
- **`src/layouts/BaseLayout.astro`**: Standard root HTML document containing meta tags, Anti-FOUC theme handler, accessible skip link (`#main-content`), sticky header with responsive controls (Theme toggle, RSS, Medium, GitHub), global toast handler (`showToast`), and footer.
- **`src/layouts/PostLayout.astro`**: Layout for individual articles. Automatically injects `BlogPosting` JSON-LD structured data, handles responsive table of contents (TOC), image lightboxes, Mermaid rendering, copy buttons on code blocks, and Medium links.

### 4.2 Content Collections
Articles are stored in `src/content/posts/*.md`.
Frontmatter schema defined in `src/content/config.ts`:
```typescript
{
  title: string;
  date: string; // YYYY-MM-DD
  author?: string; // defaults to 'Pascal Riester'
  category: string;
  tags: string[];
  summary: string;
  description?: string;
  cover?: string;
  canonical?: string;
  mediumUrl?: string;
}
```

### 4.3 Routing
- Home page: `src/pages/index.astro`
- Post articles: `src/pages/[slug].astro` (canonical URL format `/[slug]/`)
- Backward compatibility: `src/pages/posts/[slug].astro` redirects legacy `/posts/[slug]/` URLs to `/[slug]/` with canonical headers.
- Impressum: `src/pages/impressum.astro`
- 404: `src/pages/404.astro`

---

## 🧩 5. UI Component Conventions

1. **Card Containers**:
   Use `rounded-2xl` or `rounded-3xl` with `bg-white dark:bg-slate-900` and `border border-slate-200 dark:border-slate-800`.
   Add hover effects: `hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all`.

2. **Buttons & Pills**:
   - Primary action: `bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl px-4 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm transition-all`.
   - Secondary / Subtle: `bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all`.
   - Accent / Active: `bg-blue-600 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm`.

3. **Tags & Hashtags**:
   `text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono`.

4. **Accessibility (WCAG AA)**:
   - Ensure text contrast meets at least 4.5:1. Never use `text-slate-400` on white backgrounds for small text; use `text-slate-500 dark:text-slate-400`.
   - Interactive buttons must carry appropriate `aria-label` or `aria-pressed` states.
   - All pages must maintain the `#main-content` anchor for skip links.
   - Search inputs require associated `<label>` (can be `.sr-only`).

5. **Images**:
   - Provide explicit `width` and `height` attributes on images to prevent CLS (Cumulative Layout Shift).
   - Use `loading="lazy"` on below-the-fold images and `loading="eager"` on above-the-fold hero elements.

6. **Code Blocks & Mermaid Diagrams**:
   - Code blocks are enhanced in `PostLayout.astro` with copy buttons and language pills.
   - Mermaid diagrams render in `.mermaid-container` with reactive dark/light palette switching.

---

## ⚙️ 6. Checklist for New Pages and Modifications

Before completing any task, every agent must verify:
- [ ] Pages use `BaseLayout` or `PostLayout`.
- [ ] `<main>` has `id="main-content"` for accessibility.
- [ ] Favicon uses `/favicon.svg` and `🛡️` SVG.
- [ ] Navigation header matches the responsive glassmorphism template with theme toggle, RSS, Medium, and GitHub buttons.
- [ ] Main container uses `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`.
- [ ] Footer uses standard 3-column layout with `#current-year` dynamic year and RSS link.
- [ ] No hardcoded inline light/dark styles that conflict with Tailwind `dark:` classes.
- [ ] Contrast meets WCAG AA standards.
- [ ] Feeds are generated (`node ./scripts/generate-feeds.mjs` runs on build).
