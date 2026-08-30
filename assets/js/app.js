// Main App JavaScript

// Theme Toggle Management
const initTheme = () => {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcons();
    });
  });

  updateThemeIcons();
};

const updateThemeIcons = () => {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('.sun-icon').forEach(el => {
    el.classList.toggle('hidden', isDark);
  });
  document.querySelectorAll('.moon-icon').forEach(el => {
    el.classList.toggle('hidden', !isDark);
  });
};

// Mobile Navigation Toggle
const initMobileMenu = () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
};

// Active Nav Link Highlighting
const highlightActiveNav = () => {
  const path = window.location.pathname;
  const page = path.split("/").pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active', 'text-blue-600', 'dark:text-blue-400');
    }
  });
};

// Global Toast Notification
const showToast = (message, type = 'info') => {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900';
  toast.className = `flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all transform duration-300 opacity-0 translate-y-2 pointer-events-auto ${bgClass}`;
  toast.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};

// Dynamic Year
const initYear = () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

// Run on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  highlightActiveNav();
  initYear();
});
