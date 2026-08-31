// Main App JavaScript

// Theme Toggle Management
const updateThemeIcons = () => {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('.sun-icon').forEach(el => el.classList.toggle('hidden', isDark));
  document.querySelectorAll('.moon-icon').forEach(el => el.classList.toggle('hidden', !isDark));
};

const initTheme = () => {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcons();
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
    });
  });
  updateThemeIcons();
};

// Global Toast Notification
const showToast = (message, type = 'info') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900';
  toast.className = `flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 opacity-0 translate-y-2 pointer-events-auto ${bgClass}`;
  toast.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('opacity-0', 'translate-y-2'));

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};

// Dynamic Year
const initYear = () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

// Run on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initYear();
});
