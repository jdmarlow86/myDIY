const THEME_STORAGE_KEY = 'myDIY:theme';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const toggleButton = document.querySelector('[data-theme-toggle]');
    const themeLabel = document.querySelector('[data-theme-label]');
    const themeIcon = document.querySelector('[data-theme-icon]');
    const currentYearEl = document.getElementById('current-year');

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    let theme = storedTheme || (prefersDark.matches ? 'dark' : 'light');
    let manualOverride = Boolean(storedTheme);

    const applyTheme = mode => {
        const isDark = mode === 'dark';
        root.classList.toggle('dark-mode', isDark);

        if (toggleButton) {
            toggleButton.setAttribute('aria-pressed', String(isDark));
        }

        if (themeLabel) {
            themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
        }

        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }
    };

    applyTheme(theme);

    toggleButton?.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        manualOverride = true;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        applyTheme(theme);
    });

    const handleSchemeChange = event => {
        if (manualOverride) {
            return;
        }
        theme = event.matches ? 'dark' : 'light';
        applyTheme(theme);
    };

    if (typeof prefersDark.addEventListener === 'function') {
        prefersDark.addEventListener('change', handleSchemeChange);
    } else if (typeof prefersDark.addListener === 'function') {
        prefersDark.addListener(handleSchemeChange);
    }
});
