# 🛡️ Pascal Riester — Microsoft Entra ID & Identity Security Blog

A fast, lightweight, and modern engineering blog powered by **Astro SSG** and hosted on **GitHub Pages**, dedicated to **Microsoft Entra ID (Azure AD)**, **Conditional Access**, **Privileged Identity Management (PIM)**, and **Identity & Access Management (IAM)** within the Microsoft Cloud.

Cross-published and syndicated with [Medium (@riesterpascal)](https://medium.com/@riesterpascal).

![Framework](https://img.shields.io/badge/Framework-Astro%20SSG-FF5D01)
![Platform](https://img.shields.io/badge/Platform-GitHub%20Pages-blue)
![Focus](https://img.shields.io/badge/Focus-Microsoft%20Entra%20ID-0078D4)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Core Topics & Focus Areas

- **Microsoft Entra ID & Conditional Access:** Tiered location strategies, persona-based policy frameworks, phishing-resistant MFA, and break-glass protection.
- **Privileged Identity Management (PIM):** Just-in-Time (JIT) activations, PIM for Groups, and multi-stage approval governance.
- **Identity Governance & Lifecycle Workflows:** Automating Joiner-Mover-Leaver processes, Access Packages, and recurring Access Reviews.
- **Zero Trust Security:** Enforcing device compliance with Microsoft Intune, continuous access evaluation (CAE), and Microsoft Defender for Identity integrations.

---

## 📁 Repository Structure

```text
├── .github/
│   ├── dependabot.yml            # Weekly dependency & Actions updates
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions Astro build, validation & Pages deployment
├── public/                       # Static public assets (self-hosted fonts, images, Mermaid, favicon, robots.txt, .nojekyll)
│   ├── assets/
│   │   ├── fonts/
│   │   ├── img/
│   │   └── js/mermaid.min.js
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   ├── astro.mjs                 # Astro CLI wrapper (Windows drive casing fix)
│   └── validate-feeds.mjs        # Post-build XML feed, search index & dist link/asset check
├── src/
│   ├── components/
│   │   └── Comments.astro        # Lazy-loaded Giscus comments (GitHub Discussions)
│   ├── content/
│   │   └── posts/                # Markdown articles (.md)
│   ├── content.config.ts         # Astro Content Layer glob loader & Zod schema
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Core HTML layout, Anti-FOUC, Header, Footer, Open Graph
│   │   └── PostLayout.astro      # Article layout with TOC, lazy Mermaid, Callouts, Code copy, Prev/Next
│   ├── pages/
│   │   ├── [slug].astro          # Dedicated static post pages (/[slug]/)
│   │   ├── posts/[slug].astro    # Legacy /posts/[slug]/ redirect with canonical header
│   │   ├── index.astro           # Homepage with category filters & lazy full-text search
│   │   ├── impressum.astro       # Legal notice (DDG / MStV)
│   │   ├── datenschutz.astro     # Privacy policy (DSGVO)
│   │   ├── rss.xml.ts            # Build-time RSS 2.0 feed endpoint
│   │   ├── sitemap.xml.ts        # Build-time XML sitemap endpoint
│   │   ├── search-index.json.ts  # Build-time search index endpoint
│   │   └── 404.astro             # Custom 404 error page
│   └── styles/
│       └── custom.css            # Tailwind CSS v4 entry, dark variant, fonts, typography, callouts, print styles
├── astro.config.mjs              # Astro 7 configuration (SSG output, @tailwindcss/vite, Shiki)
└── package.json                  # Dependencies and build scripts
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build static site for production + run TypeScript & feed/link validation (outputs to ./dist)
npm run build

# Typecheck and validate Astro templates
npm run check

# Preview production build locally
npm run preview
```

---

## ✍️ How to Publish a New Entra ID Article

1. Add a new `.md` file in `src/content/posts/` (e.g. `src/content/posts/entra-verified-id-guide.md`).
2. Add the frontmatter header:
   ```markdown
   ---
   title: "Your Article Title"
   date: "2026-09-01"
   author: "Pascal Riester"
   category: "Conditional Access"
   tags: [EntraID, ConditionalAccess, ZeroTrust]
   summary: "A concise technical summary for social cards and previews."
   canonical: "https://medium.com/@riesterpascal/your-story-slug" # optional Medium link
   ---

   ## Introduction

   Your article content in standard Markdown...
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add new article on Entra ID"
   git push
   ```
   GitHub Actions will automatically build the static pages and deploy them to GitHub Pages.

---

## 🚀 Live Website
👉 **[https://entraidfieldnotes.com](https://entraidfieldnotes.com)**  
Medium: **[https://medium.com/@riesterpascal](https://medium.com/@riesterpascal)**
