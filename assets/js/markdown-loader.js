// Markdown rendering, Mermaid diagrams & Prism code block enhancement utility

class MarkdownLoader {
  constructor(options = {}) {
    this.containerId = options.containerId || 'markdown-container';
    this.tocContainerId = options.tocContainerId || 'toc-container';
    this.loadingId = options.loadingId || 'loading-indicator';
    this.headings = [];

    window.addEventListener('themeChanged', () => this.renderMermaid());
  }

  // Parse YAML Frontmatter
  parseFrontmatter(markdown) {
    const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!match) return { data: {}, content: markdown };

    const data = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        }
        data[key] = val;
      }
    });

    if (data.description && !data.summary) data.summary = data.description;
    return { data, content: markdown.slice(match[0].length) };
  }

  // Calculate reading time
  calculateReadingTime(text) {
    return `${Math.ceil(text.trim().split(/\s+/).length / 200)} min read`;
  }

  // Load and render markdown file
  async load(filePath) {
    const container = document.getElementById(this.containerId);
    const loading = document.getElementById(this.loadingId);

    if (loading) loading.classList.remove('hidden');
    if (container) container.innerHTML = '';

    try {
      const fetchUrl = `${filePath}${filePath.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const response = await fetch(fetchUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Failed to load article (${response.status}: ${response.statusText})`);

      const rawMarkdown = await response.text();
      const { data, content } = this.parseFrontmatter(rawMarkdown);

      await this.render(content);
      return { success: true, metadata: data, raw: content };
    } catch (error) {
      console.error(error);
      if (container) {
        container.innerHTML = `
          <div class="p-6 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
            <h3 class="text-base font-bold mb-2">Error Loading Document</h3>
            <p class="text-sm">${error.message}</p>
            <p class="text-xs text-rose-500 dark:text-rose-400 mt-3 font-mono">File requested: ${filePath}</p>
          </div>
        `;
      }
      return { success: false, error };
    } finally {
      if (loading) loading.classList.add('hidden');
    }
  }

  // Render markdown string
  async render(markdownString) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    this.headings = [];
    const self = this;
    const renderer = new marked.Renderer();

    renderer.heading = function (tokenOrText, levelMaybe) {
      const rawText = (typeof tokenOrText === 'object' ? tokenOrText.text || tokenOrText.raw : tokenOrText) || '';
      const depth = (typeof tokenOrText === 'object' ? tokenOrText.depth : levelMaybe) || 1;
      const cleanText = String(rawText).replace(/<[^>]*>/g, '').trim();
      const id = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

      if (depth <= 3 && cleanText) self.headings.push({ text: cleanText, id, level: depth });

      return `
        <h${depth} id="${id}" class="group relative flex items-center">
          <span class="mr-2">${cleanText}</span>
          <a href="#${id}" class="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-600 no-underline text-base ml-1" aria-label="Link to section">#</a>
        </h${depth}>
      `;
    };

    renderer.code = function (tokenOrCode, langMaybe) {
      const code = (typeof tokenOrCode === 'object' ? tokenOrCode.text : tokenOrCode) || '';
      const lang = ((typeof tokenOrCode === 'object' ? tokenOrCode.lang : langMaybe) || 'text').toLowerCase().trim();

      if (lang === 'mermaid') {
        return `
          <div class="mermaid-container my-8 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center overflow-x-auto min-h-[140px]" data-mermaid-code="${encodeURIComponent(code.trim())}">
            <div class="text-xs text-slate-400 font-medium animate-pulse">Rendering diagram...</div>
          </div>
        `;
      }

      const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `
        <div class="code-block-wrapper my-6">
          <div class="code-header">
            <span>${lang.toUpperCase()}</span>
            <button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').innerText).then(() => showToast('Code copied to clipboard!', 'success'))">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <span>Copy</span>
            </button>
          </div>
          <pre class="!m-0 !p-4 !bg-slate-900 text-slate-100 text-sm overflow-x-auto"><code class="language-${lang}">${escapedCode}</code></pre>
        </div>
      `;
    };

    renderer.image = function (tokenOrHref, titleMaybe, textMaybe) {
      const href = (typeof tokenOrHref === 'object' ? tokenOrHref.href : tokenOrHref) || '';
      const text = (typeof tokenOrHref === 'object' ? tokenOrHref.text : textMaybe) || '';
      const title = (typeof tokenOrHref === 'object' ? tokenOrHref.title : titleMaybe) || '';

      return `
        <figure class="my-8">
          <img src="${href}" alt="${text}" title="${title}" loading="lazy" class="w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" />
          ${text ? `<figcaption class="text-xs text-center text-slate-500 dark:text-slate-400 mt-2.5 italic">${text}</figcaption>` : ''}
        </figure>
      `;
    };

    marked.use({ renderer, breaks: true, gfm: true });
    container.innerHTML = marked.parse(markdownString);

    if (window.Prism) Prism.highlightAllUnder(container);
    await this.renderMermaid();
    this.buildTOC();
  }

  // Render or Re-render Mermaid Diagrams
  async renderMermaid() {
    if (!window.mermaid) return;

    const isDark = document.documentElement.classList.contains('dark');
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        themeVariables: isDark ? {
          darkMode: true,
          background: '#0f172a',
          primaryColor: '#3b82f6',
          primaryTextColor: '#f8fafc',
          primaryBorderColor: '#60a5fa',
          lineColor: '#94a3b8',
          secondaryColor: '#1e293b',
          tertiaryColor: '#0f172a'
        } : {
          darkMode: false,
          background: '#ffffff',
          primaryColor: '#3b82f6',
          primaryTextColor: '#0f172a',
          primaryBorderColor: '#2563eb',
          lineColor: '#64748b',
          secondaryColor: '#f1f5f9',
          tertiaryColor: '#f8fafc'
        }
      });

      const containers = document.querySelectorAll('.mermaid-container');
      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const rawCode = decodeURIComponent(container.getAttribute('data-mermaid-code') || '').trim();
        if (!rawCode) continue;

        const uniqueId = `mermaid_chart_${i}_${Math.random().toString(36).substring(2, 8)}`;
        try {
          const { svg } = await mermaid.render(uniqueId, rawCode);
          container.innerHTML = `<div class="mermaid-svg-wrapper w-full flex justify-center items-center">${svg}</div>`;
        } catch (err) {
          console.error('Mermaid render error:', err);
          container.innerHTML = `
            <div class="w-full p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs">
              <span class="font-bold">Diagram Render Error:</span> ${err.message || 'Syntax error'}
            </div>
          `;
        }
      }
    } catch (e) {
      console.error('Mermaid initialization error:', e);
    }
  }

  // Build Table of Contents
  buildTOC() {
    const tocContainer = document.getElementById(this.tocContainerId);
    if (!tocContainer) return;

    if (this.headings.length === 0) {
      tocContainer.innerHTML = '<p class="text-xs text-slate-400 italic">No sections found</p>';
      return;
    }

    let tocHtml = '<ul class="space-y-1.5 text-sm border-l border-slate-200 dark:border-slate-800 pl-3">';
    this.headings.forEach(h => {
      const indentClass = h.level === 3 ? 'pl-3 text-xs' : h.level === 2 ? 'pl-1' : '';
      tocHtml += `
        <li class="${indentClass}">
          <a href="#${h.id}" class="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-0.5">${h.text}</a>
        </li>
      `;
    });
    tocHtml += '</ul>';
    tocContainer.innerHTML = tocHtml;
  }
}

