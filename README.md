# 🚀 Developer Portfolio, Blog & Documentation Site

A modern, lightweight, and fast developer website built specifically for **GitHub Pages**. Features an engineering blog with live search, a multi-page documentation portal with table-of-contents navigation, syntax-highlighted code blocks with copy buttons, dark/light theme switching, and zero local runtime dependencies.

![Website Preview](https://img.shields.io/badge/Platform-GitHub%20Pages-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![No Build Required](https://img.shields.io/badge/Dependencies-Zero%20Local%20Install-purple)

---

## ✨ Features

- **⚡ Zero Build Toolchain Required:** Run and edit directly with standard web primitives (HTML5, Tailwind CSS, JavaScript ES6+).
- **📝 Markdown-Powered Blog:** Write articles in standard Markdown with YAML frontmatter; auto-renders with syntax highlighting and reading time calculation.
- **📚 Interactive Documentation Hub:** Left-hand category sidebar, right-hand dynamic "On This Page" Table of Contents, and instant search.
- **🎨 Dark & Light Mode:** Seamless theme toggle with local storage persistence and system preference detection.
- **💻 Prism.js Syntax Highlighting:** Clean code blocks with copy-to-clipboard buttons and language badges.
- **📱 Fully Responsive:** Optimized layout across mobile, tablet, and widescreen desktop displays.
- **🔄 GitHub Actions Workflow:** Automated deployment with `.github/workflows/deploy.yml`.

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── assets/
│   ├── css/
│   │   └── custom.css          # Theme styles, scrollbars, and markdown typography
│   ├── js/
│   │   ├── app.js              # Theme manager, mobile menu, toast notifications
│   │   └── markdown-loader.js   # Marked.js parser, TOC generator, Prism highlighter
│   └── img/                    # Static images and icons
├── content/
│   ├── posts/                  # Blog post Markdown files
│   │   ├── welcome-to-my-blog.md
│   │   ├── building-modern-web-apps.md
│   │   └── github-pages-workflow-guide.md
│   └── docs/                   # Documentation Markdown files
│       ├── getting-started.md
│       ├── configuration.md
│       └── deployment-guide.md
├── index.html                  # Homepage & Portfolio Showcase
├── blog.html                   # Blog directory with search & category filters
├── post.html                   # Dynamic Markdown blog reader template
├── docs.html                   # Documentation portal with sidebar navigation
├── projects.html               # Project showcase & demo catalog
├── about.html                  # Developer biography & skill matrix
├── 404.html                    # Custom 404 error page
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🚀 How to Deploy to GitHub Pages

### 1. Initialize Git & Commit Files
In your project directory, run:
```bash
git init
git add .
git commit -m "feat: initial developer portfolio and blog repository"
```

### 2. Create a GitHub Repository
- Create a new public repository on [GitHub](https://github.com/new).
- For a primary user site, name the repository: `<your-username>.github.io` (e.g. `octocat.github.io`).
- Do **not** initialize with a README or .gitignore.

### 3. Push to GitHub
```bash
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository on GitHub: **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The included workflow (`deploy.yml`) will automatically trigger and publish your website!

Your website will be live at:
```text
https://<your-username>.github.io
```

---

## ✍️ Adding Content

### Adding a New Blog Post
1. Create a `.md` file in `content/posts/` (e.g. `content/posts/my-new-post.md`).
2. Add frontmatter metadata:
   ```markdown
   ---
   title: "Your Post Title"
   date: 2026-09-01
   author: "Your Name"
   category: "Architecture"
   tags: [JavaScript, WebDev]
   summary: "A brief summary of what this article covers."
   ---

   # Your Post Title

   Your markdown content here...
   ```
3. Add the post object to the `blogPosts` array in `blog.html` to include it in the searchable directory.

### Adding a New Documentation Page
1. Create a `.md` file in `content/docs/` (e.g. `content/docs/api-guide.md`).
2. Add a navigation button in `docs.html`:
   ```html
   <button onclick="loadDocFile('content/docs/api-guide.md', this)" class="doc-nav-btn ...">
     API Guide
   </button>
   ```

---

## 🛠 Customization

- **Name & Branding:** Search and replace `Pascal` with your name across HTML files.
- **Theme Colors:** The site uses Tailwind CSS classes (e.g., `text-blue-600`, `bg-blue-600`). You can swap `blue` for `emerald`, `indigo`, `purple`, or any Tailwind palette.
- **Custom Domain:** In GitHub **Settings** > **Pages**, add your custom domain and configure your DNS `CNAME` or `A` records.

---

## 📄 License

MIT License © 2026. Free to use, modify, and distribute for personal or commercial projects.
