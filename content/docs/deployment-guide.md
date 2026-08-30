---
title: GitHub Pages Deployment Guide
description: Complete instructions for pushing this repository to GitHub and enabling GitHub Pages.
category: Deployment
order: 3
---

# GitHub Pages Deployment Guide

Follow this step-by-step guide to take your website live on GitHub Pages with HTTPS and custom domain support.

---

## Step 1: Initialize Git and Create Local Commit

Open your terminal in the website project root folder and run:

```bash
# Initialize git repository
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: initial commit for developer blog & docs site"
```

---

## Step 2: Create a New GitHub Repository

1. Go to [GitHub New Repository](https://github.com/new).
2. For a user site, name the repository exactly:
   ```text
   <your-github-username>.github.io
   ```
3. Set the repository visibility to **Public**.
4. Do **not** check "Add a README file", ".gitignore", or "License" (we already created them).
5. Click **Create repository**.

---

## Step 3: Connect Remote and Push Code

Run the following commands in your terminal, replacing `<your-github-username>` with your actual GitHub username:

```bash
git remote add origin https://github.com/<your-github-username>/<your-github-username>.github.io.git
git branch -M main
git push -u origin main
```

---

## Step 4: Enable GitHub Pages in Repository Settings

1. In your GitHub repository, click on **Settings** (top right tab).
2. On the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (the `.github/workflows/deploy.yml` workflow will automatically run and publish your site).
4. Once the action completes (usually in ~30 seconds), your live site will be accessible at:
   ```text
   https://<your-github-username>.github.io
   ```

---

## Step 5: (Optional) Custom Domain Configuration

If you want to use your own domain (e.g. `yourname.dev` or `blog.yourname.com`):
1. In repository **Settings** > **Pages**, enter your domain in **Custom domain** and save.
2. In your DNS provider (e.g. Cloudflare, Namecheap, Google Domains):
   - For an apex domain (`yourname.dev`): Create `A` records pointing to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - For a subdomain (`blog.yourname.com`): Create a `CNAME` record pointing to `<your-username>.github.io`.
3. Check the **Enforce HTTPS** box in GitHub Pages settings.
