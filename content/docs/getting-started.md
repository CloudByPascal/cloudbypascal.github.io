---
title: Getting Started
description: Overview of project structure and how to navigate the repository.
category: Quick Start
order: 1
---

# Getting Started

Welcome to your new developer documentation and blog template. This project is crafted to be lightweight, modular, and instantly deployable to **GitHub Pages** without requiring local Node.js or npm toolchains.

---

## Directory Structure

Here is an overview of how files and directories are organized in this repository:

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions automated deployment workflow
├── assets/
│   ├── css/
│   │   └── custom.css        # Custom styles, fonts, and markdown styling
│   ├── js/
│   │   ├── app.js            # Theme toggle, mobile menu, notifications
│   │   └── markdown-loader.js # Dynamic markdown parser & Prism syntax highlighter
│   └── img/                  # Images and static media assets
├── content/
│   ├── posts/                # Blog articles in Markdown (.md)
│   └── docs/                 # Documentation pages in Markdown (.md)
├── index.html                # Homepage & Portfolio Showcase
├── blog.html                 # Blog listing with live search & filters
├── post.html                 # Markdown post reader & article template
├── docs.html                 # Documentation browser with sidebar navigation
├── projects.html             # Portfolio projects showcase
├── about.html                # About developer page & skill matrix
├── 404.html                  # Custom 404 error page
├── .nojekyll                 # Bypasses Jekyll processing on GitHub Pages
├── .gitignore                # Ignored files list
└── README.md                 # Project documentation
```

---

## Adding New Blog Posts

To publish a new blog post:
1. Create a `.md` file in `content/posts/` (e.g. `content/posts/my-new-post.md`).
2. Add YAML frontmatter at the top of the file:
   ```yaml
   ---
   title: "Your Post Title"
   date: 2026-09-01
   author: "Your Name"
   category: "Tutorial"
   tags: [JavaScript, Architecture]
   summary: "A brief 1-2 sentence summary of your post."
   ---
   ```
3. Write your content in standard Markdown.
4. Add the post reference to the `posts` array in `blog.html` and `index.html` if you want it featured.

---

## Adding New Documentation Pages

1. Add a Markdown file to `content/docs/` (e.g. `content/docs/api-reference.md`).
2. Add the link into the left sidebar in `docs.html`:
   ```html
   <button onclick="loadDoc('content/docs/api-reference.md', this)" class="doc-link ...">
     API Reference
   </button>
   ```
