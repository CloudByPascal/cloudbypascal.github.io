# 🛡️ Pascal Riester — Microsoft Entra ID & Identity Security Blog

A fast, lightweight, and modern engineering blog hosted on **GitHub Pages**, dedicated to **Microsoft Entra ID (Azure AD)**, **Conditional Access**, **Privileged Identity Management (PIM)**, and **Identity & Access Management (IAM)** within the Microsoft Cloud.

Cross-published and syndicated with [Medium (@riesterpascal)](https://medium.com/@riesterpascal).

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
│   └── workflows/
│       └── deploy.yml                                            # Automated GitHub Pages CI/CD
├── assets/
│   ├── css/custom.css                                            # Theme styling, fonts, code blocks
│   └── js/
│       ├── app.js                                                # Theme manager, toast alerts
│       └── markdown-loader.js                                     # Markdown parser, TOC, Prism highlighter
├── content/
│   └── posts/                                                    # Articles in Markdown (.md)
│       ├── an-approach-to-handling-travelling-users-within-entra-id.md
│       ├── designing-zero-trust-conditional-access-baselines.md
│       ├── mastering-entra-pim-and-jit-access.md
│       └── welcome-to-my-blog.md
├── index.html                                                    # Blog Feed & Search Homepage
├── post.html                                                     # Dynamic Markdown Article Reader
├── 404.html                                                      # Custom 404 error page
└── README.md
```

---

## ✍️ How to Publish a New Entra ID Article

1. Create a `.md` file in `content/posts/` (e.g. `content/posts/entra-verified-id-guide.md`).
2. Add the frontmatter header:
   ```markdown
   ---
   title: "Your Article Title"
   date: 2026-09-01
   author: "Pascal Riester"
   category: "Entra ID"
   tags: [EntraID, ConditionalAccess, ZeroTrust]
   summary: "A concise summary of your article."
   canonical: "https://medium.com/@riesterpascal/your-story-slug" # optional Medium link
   ---

   # Your Article Title

   Your article content in standard Markdown...
   ```
3. Add the post object to the `blogPosts` array in `index.html`.
4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add new article on Entra ID"
   git push
   ```

---

## 🚀 Live Website
👉 **[https://cloudbypascal.github.io](https://cloudbypascal.github.io)**  
Medium: **[https://medium.com/@riesterpascal](https://medium.com/@riesterpascal)**
