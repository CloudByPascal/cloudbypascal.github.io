// Markdown rendering, Mermaid diagrams & Prism code block enhancement utility

class MarkdownLoader {
  constructor(options = {}) {
    this.containerId = options.containerId || 'markdown-container';
    this.tocContainerId = options.tocContainerId || 'toc-container';
    this.loadingId = options.loadingId || 'loading-indicator';
    this.headings = [];
    this.currentRawMarkdown = '';

    // Listen for theme toggle events to dynamically re-render Mermaid charts
    window.addEventListener('themeChanged', () => {
      this.renderMermaid();
    });
  }

  // Parse YAML Frontmatter
  parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
      return { data: {}, content: markdown };
    }

    const yamlBlock = match[1];
    const content = markdown.slice(match[0].length);
    const data = {};

    yamlBlock.split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        // Parse array if tags: [tag1, tag2]
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        }
        data[key] = value;
      }
    });

    return { data, content };
  }

  // Calculate reading time
  calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  // Load and render markdown file
  async load(filePath) {
    const container = document.getElementById(this.containerId);
    const loading = document.getElementById(this.loadingId);

    if (loading) loading.classList.remove('hidden');
    if (container) container.innerHTML = '';

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load article (${response.status}: ${response.statusText})`);
      }

      const rawMarkdown = await response.text();
      const { data, content } = this.parseFrontmatter(rawMarkdown);

      this.currentRawMarkdown = content;
      await this.render(content, data);
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
  async render(markdownString, metadata = {}) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    this.headings = [];
    const self = this;

    // Custom renderer for marked
    const renderer = new marked.Renderer();

    // Universal heading handler (supporting modern Marked v12+ token objects & legacy positional args)
    renderer.heading = function (tokenOrText, levelMaybe, rawMaybe) {
      let rawText = '';
      let depth = 1;

      if (tokenOrText && typeof tokenOrText === 'object') {
        rawText = tokenOrText.text || tokenOrText.raw || '';
        depth = tokenOrText.depth || 1;
      } else {
        rawText = String(tokenOrText || '');
        depth = levelMaybe || 1;
      }

      const cleanText = String(rawText).replace(/<[^>]*>/g, '').trim();
      const id = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      if (depth <= 3 && cleanText) {
        self.headings.push({ text: cleanText, id, level: depth });
      }

      return `
        <h${depth} id="${id}" class="group relative flex items-center">
          <span class="mr-2">${cleanText}</span>
          <a href="#${id}" class="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-600 no-underline text-base ml-1" aria-label="Link to section">#</a>
        </h${depth}>
      `;
    };

    // Universal code block & Mermaid handler
    renderer.code = function (tokenOrCode, langMaybe) {
      let code = '';
      let lang = 'text';

      if (tokenOrCode && typeof tokenOrCode === 'object') {
        code = tokenOrCode.text || '';
        lang = tokenOrCode.lang || 'text';
      } else {
        code = String(tokenOrCode || '');
        lang = langMaybe || 'text';
      }

      const language = (lang || 'text').toLowerCase().trim();

      // Special handling for Mermaid charts
      if (language === 'mermaid') {
        const encodedCode = encodeURIComponent(code);
        return `
          <div class="mermaid-container my-8 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center overflow-x-auto min-h-[120px]" data-mermaid-code="${encodedCode}">
            <div class="text-xs text-slate-400 animate-pulse">Rendering diagram...</div>
          </div>
        `;
      }

      const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      return `
        <div class="code-block-wrapper my-6">
          <div class="code-header">
            <span>${language.toUpperCase()}</span>
            <button class="copy-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(code)}')).then(() => showToast('Code copied to clipboard!', 'success'))">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <span>Copy</span>
            </button>
          </div>
          <pre class="!m-0 !p-4 !bg-slate-900 text-slate-100 text-sm overflow-x-auto"><code class="language-${language}">${escapedCode}</code></pre>
        </div>
      `;
    };

    // Universal image handler with lazy loading and captions
    renderer.image = function (tokenOrHref, titleMaybe, textMaybe) {
      let href = '';
      let text = '';
      let title = '';

      if (tokenOrHref && typeof tokenOrHref === 'object') {
        href = tokenOrHref.href || '';
        text = tokenOrHref.text || '';
        title = tokenOrHref.title || '';
      } else {
        href = String(tokenOrHref || '');
        title = titleMaybe || '';
        text = textMaybe || '';
      }

      return `
        <figure class="my-8">
          <img src="${href}" alt="${text}" title="${title}" loading="lazy" class="w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" />
          ${text ? `<figcaption class="text-xs text-center text-slate-500 dark:text-slate-400 mt-2.5 italic">${text}</figcaption>` : ''}
        </figure>
      `;
    };

    if (typeof marked.use === 'function') {
      marked.use({ renderer, breaks: true, gfm: true });
    } else if (typeof marked.setOptions === 'function') {
      marked.setOptions({ renderer, breaks: true, gfm: true });
    }

    container.innerHTML = marked.parse(markdownString);

    // Apply Prism syntax highlighting if available
    if (window.Prism) {
      Prism.highlightAllUnder(container);
    }

    // Render Mermaid diagrams
    await this.renderMermaid();

    // Build Table of Contents
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
        const rawCode = decodeURIComponent(container.getAttribute('data-mermaid-code') || '');
        if (!rawCode) continue;

        const uniqueId = `mermaid-chart-${i}-${Date.now()}`;
        try {
          const { svg } = await mermaid.render(uniqueId, rawCode);
          container.innerHTML = svg;
        } catch (err) {
          console.error('Mermaid render error:', err);
          container.innerHTML = `
            <div class="w-full p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs">
              <span class="font-bold">Diagram Render Error:</span> ${err.message || 'Invalid diagram syntax'}
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
