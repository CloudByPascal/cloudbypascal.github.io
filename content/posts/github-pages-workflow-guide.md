---
title: Complete Guide to GitHub Pages & GitHub Actions
date: 2026-08-20
author: Pascal
category: DevOps
tags: [DevOps, GitHubActions, CI/CD, Tutorial]
summary: Learn how to set up zero-downtime automated static deployments to GitHub Pages using GitHub Actions.
---

# Complete Guide to GitHub Pages & GitHub Actions

GitHub Pages provides free, secure, and fast hosting for static web projects. By pairing it with GitHub Actions, you gain full control over the build and release lifecycle.

---

## 1. Setting Up the Repository

For a primary user or organization site, name your repository:
```text
<your-username>.github.io
```

For a project-specific site:
```text
https://<your-username>.github.io/<repository-name>/
```

---

## 2. GitHub Pages Deployment Configuration

In your GitHub repository settings:
1. Navigate to **Settings** > **Pages**
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**
3. Push your code to the `main` branch!

---

## 3. Custom Domain Setup

If you own a custom domain (e.g. `example.com`), create a `CNAME` file at the root of your repository:

```text
blog.yourdomain.com
```

Then in your DNS provider (Cloudflare, Namecheap, Route53), add a `CNAME` record pointing to `<username>.github.io`.

---

## 4. Helpful Git Commands

```bash
# Initialize git repository
git init
git add .
git commit -m "feat: initial commit for developer site"

# Link to GitHub remote and push
git remote add origin https://github.com/<username>/<username>.github.io.git
git branch -M main
git push -u origin main
```
