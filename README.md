# ☁️ cloudbypascal — Engineering & Cloud Blog

A fast, lightweight, and modern developer blog hosted on **GitHub Pages**. Designed with pure static web primitives (HTML5, Tailwind CSS, JavaScript ES6+, Marked.js, Prism.js) for zero local build overhead and instant edge performance.

![Platform](https://img.shields.io/badge/Platform-GitHub%20Pages-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Build](https://img.shields.io/badge/Dependencies-Zero%20Local%20Install-purple)

---

## ✨ Features

- **⚡ Zero Build Runtime Required:** No Node.js or npm toolchain needed locally. Edit Markdown files and push directly to GitHub.
- **📝 Markdown-Powered Articles:** Write articles in standard Markdown with YAML frontmatter; auto-renders with syntax highlighting and reading time calculation.
- **🔍 Instant Live Search & Category Filters:** Real-time client-side search across titles, summaries, and tags.
- **🎨 Dark & Light Mode:** Seamless theme toggle with local storage persistence and system preference detection.
- **💻 Prism.js Code Syntax Highlighting:** Clean code blocks with copy-to-clipboard buttons and language labels.
- **📱 Responsive Design:** Optimized for mobile, tablet, and widescreen reading.
- **🚀 Automated Deployment:** Includes GitHub Actions workflow (`deploy.yml`) for continuous zero-downtime publishing.

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── assets/
│   ├── css/
│   │   └── custom.css          # Theme styling, typography, and code blocks
│   └── js/
│       ├── app.js              # Theme manager, toast notifications
│       └── markdown-loader.js   # Markdown parser, TOC generator, Prism highlighter
├── content/
│   └── posts/                  # Blog articles in Markdown (.md)
│       ├── welcome-to-my-blog.md
│       ├── building-modern-web-apps.md
│       └── github-pages-workflow-guide.md
├── index.html                  # Main Blog Homepage & Search Feed
├── post.html                   # Dynamic Markdown Article Reader Template
├── 404.html                    # Custom 404 error page
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── .gitignore                  # Git ignore rules
└── README.md                   # Repository documentation
```

---

## ✍️ How to Publish a New Blog Post

1. Create a `.md` file in `content/posts/` (e.g. `content/posts/my-new-article.md`).
2. Add the frontmatter header:
   ```markdown
   ---
   title: "Your Article Title"
   date: 2026-09-01
   author: "Pascal"
   category: "Architecture"
   tags: [Cloud, Architecture, DevOps]
   summary: "A short 1-2 sentence summary of what this post covers."
   ---

   # Your Article Title

   Write your content in standard Markdown here...
   ```
3. Add the post object to the `blogPosts` array in `index.html` so it appears in the searchable feed:
   ```javascript
   {
     id: 'my-new-article',
     file: 'my-new-article.md',
     title: 'Your Article Title',
     summary: 'A short 1-2 sentence summary of what this post covers.',
     category: 'Architecture',
     tags: ['Cloud', 'Architecture'],
     date: 'Sep 01, 2026',
     readTime: '4 min read'
   }
   ```
4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add new blog post"
   git push
   ```

---

## 🚀 Live Website
Your blog is deployed and available at:
👉 **[https://cloudbypascal.github.io](https://cloudbypascal.github.io)**

---

## 📄 License
MIT License © 2026 Pascal.
