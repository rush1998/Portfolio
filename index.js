/* ─── SIDEBAR ─────────────────────────────────────────────── */
function showSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'flex';
}

function hideSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none';
}

// Close sidebar when clicking outside
document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const nav4 = document.getElementById('nav4');
    if (sidebar && nav4 && !nav4.contains(e.target)) {
        sidebar.style.display = 'none';
    }
});

/* ─── DARK / LIGHT THEME ──────────────────────────────────── */
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon(next);

    // Spin animation
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.classList.remove('spin');
        void btn.offsetWidth; // force reflow to restart animation
        btn.classList.add('spin');
    }
}

function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    // Moon = go to dark | Sun = go to light
    btn.innerHTML = theme === 'dark'
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
}

/* ─── ON PAGE LOAD ────────────────────────────────────────── */
(function () {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    // Update icon once DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        updateToggleIcon(saved);
    });
})();
