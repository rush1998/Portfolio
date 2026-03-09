/* ─── THEME TOGGLE ────────────────────────────────────────── */
function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon(next);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.classList.remove('spin');
        void btn.offsetWidth;
        btn.classList.add('spin');
    }
}

function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
}

(function () {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.addEventListener('DOMContentLoaded', function () {
        updateToggleIcon(saved);
    });
})();

/* ─── SIDEBAR ─────────────────────────────────────────────── */
function showSidebar() {
    document.getElementById('sidebar')?.classList.add('open');
    document.getElementById('mobile-overlay')?.classList.add('visible');
    document.getElementById('hamburger-btn')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function hideSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('mobile-overlay')?.classList.remove('visible');
    document.getElementById('hamburger-btn')?.classList.remove('open');
    document.body.style.overflow = '';
}

/* ─── SCROLL PROGRESS BAR ─────────────────────────────────── */
window.addEventListener('scroll', function () {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const bar = document.getElementById('scroll-progress');
    if (bar) bar.style.width = (scrolled * 100) + '%';

    const header = document.getElementById('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── ACTIVE NAV LINK (IntersectionObserver) ────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#nav3 li a:not(.nav-cta)');
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
});

/* Close sidebar on Escape key */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideSidebar();
});
