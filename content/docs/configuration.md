---
title: Configuration & Customization
description: Customize theme colors, typography, SEO metadata, and social links.
category: Customization
order: 2
---

# Configuration & Customization

Learn how to customize styling, fonts, meta tags, and global site metadata.

---

## 1. Changing Site Metadata & Title

Update the `<head>` section in `index.html`, `blog.html`, `docs.html`, `projects.html`, and `about.html`:

```html
<title>Your Name | Developer & Architect</title>
<meta name="description" content="Portfolio, engineering blog, and developer documentation.">
<meta property="og:title" content="Your Name">
<meta property="og:description" content="Software Engineer & Technical Writer">
```

---

## 2. Customizing Color Themes

Tailwind CSS color schemes are configured directly via utility classes in the HTML and custom properties in `assets/css/custom.css`.

For example, to switch the primary accent color from Blue (`blue-600`) to Emerald (`emerald-600`) or Violet (`violet-600`), you can search and replace the Tailwind color classes:
- Replace `text-blue-600 dark:text-blue-400` with `text-emerald-600 dark:text-emerald-400`
- Replace `bg-blue-600 hover:bg-blue-700` with `bg-emerald-600 hover:bg-emerald-700`

---

## 3. Customizing Code Syntax Highlighting

The site uses **Prism.js** for high-performance code syntax highlighting. The themes included support:
- JavaScript / TypeScript
- Python
- Bash / Shell
- HTML / CSS
- JSON / YAML
- Markdown / SQL

To include additional language grammars, link Prism CDN components in the `<head>` or before `</body>`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-go.min.js"></script>
```
