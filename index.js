/* ══════════════════════════════════════════════════════════════
   NEO-BRUTALIST PORTFOLIO — index.js
══════════════════════════════════════════════════════════════ */

/* ── MARQUEE — duplicate content for seamless infinite loop ── */
(function initMarquee() {
    var track = document.getElementById('marquee-track');
    if (!track) return;
    // Clone once so we have exactly 2× content; CSS animates -50%
    track.innerHTML += track.innerHTML;
})();


/* ── MOBILE NAV ──────────────────────────────────────────── */
function toggleMobileNav() {
    var overlay = document.getElementById('mobile-overlay');
    var drawer  = document.getElementById('mobile-drawer');
    if (!overlay || !drawer) return;
    var isOpen = drawer.classList.contains('open');
    drawer.classList.toggle('open', !isOpen);
    overlay.classList.toggle('visible', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

function resetMobileNavForDesktop() {
    var overlay = document.getElementById('mobile-overlay');
    var drawer = document.getElementById('mobile-drawer');
    if (!overlay || !drawer) return;

    // Keep drawer state clean when switching back to desktop layout.
    if (window.innerWidth > 900) {
        drawer.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

window.addEventListener('resize', resetMobileNavForDesktop, { passive: true });
document.addEventListener('DOMContentLoaded', resetMobileNavForDesktop);

// Close on Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        var drawer = document.getElementById('mobile-drawer');
        if (drawer && drawer.classList.contains('open')) {
            toggleMobileNav();
        }
    }
});


/* ── PILL NAV INTERACTIONS (GSAP) ─────────────────────────── */
(function initPillNavInteractions() {
    var gsapRef = window.gsap;
    var nav = document.getElementById('nav3') || document.getElementById('nav-links');
    if (!nav) return;

    var links = Array.from(nav.querySelectorAll('a.pill-link'));
    if (!links.length) return;

    var logoMark = document.querySelector('.nav-logo-link .logo-mark');
    var logoLink = document.querySelector('.nav-logo-link');

    if (!gsapRef) {
        // Graceful fallback when GSAP fails to load.
        return;
    }

    var tlRefs = [];
    var activeTweenRefs = [];

    function buildTimelines() {
        links.forEach(function (link, i) {
            var circle = link.querySelector('.pill-hover-circle');
            var label = link.querySelector('.pill-label');
            var labelHover = link.querySelector('.pill-label-hover');
            if (!circle || !label || !labelHover) return;

            var rect = link.getBoundingClientRect();
            var w = rect.width;
            var h = rect.height;

            var R = ((w * w) / 4 + h * h) / (2 * h);
            var D = Math.ceil(2 * R) + 2;
            var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            var originY = D - delta;

            circle.style.width = D + 'px';
            circle.style.height = D + 'px';
            circle.style.bottom = '-' + delta + 'px';

            gsapRef.set(circle, { xPercent: -50, scale: 0, transformOrigin: '50% ' + originY + 'px' });
            gsapRef.set(label, { y: 0 });
            gsapRef.set(labelHover, { y: h + 10, opacity: 0 });

            if (tlRefs[i]) tlRefs[i].kill();
            var tl = gsapRef.timeline({ paused: true });
            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }, 0)
              .to(label, { y: -(h + 8), duration: 0.6, ease: 'power3.out', overwrite: 'auto' }, 0)
              .to(labelHover, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }, 0);

            tlRefs[i] = tl;
        });

        syncActivePills();
    }

    function syncActivePills() {
        links.forEach(function (link, i) {
            var tl = tlRefs[i];
            if (!tl) return;
            if (link.classList.contains('active')) {
                tl.progress(1);
            } else {
                tl.progress(0);
            }
        });
    }

    function handleEnter(i) {
        var tl = tlRefs[i];
        if (!tl) return;
        if (links[i].classList.contains('active')) return;
        if (activeTweenRefs[i]) activeTweenRefs[i].kill();
        activeTweenRefs[i] = tl.tweenTo(tl.duration(), { duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    }

    function handleLeave(i) {
        var tl = tlRefs[i];
        if (!tl) return;
        if (links[i].classList.contains('active')) return;
        if (activeTweenRefs[i]) activeTweenRefs[i].kill();
        activeTweenRefs[i] = tl.tweenTo(0, { duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
    }

    links.forEach(function (link, i) {
        link.addEventListener('mouseenter', function () { handleEnter(i); });
        link.addEventListener('mouseleave', function () { handleLeave(i); });
    });

    if (logoLink && logoMark) {
        logoLink.addEventListener('mouseenter', function () {
            gsapRef.to(logoMark, {
                rotate: 360,
                duration: 0.8,
                ease: 'elastic.out(1,0.5)',
                overwrite: 'auto',
                onComplete: function () {
                    gsapRef.set(logoMark, { rotate: 0 });
                }
            });
        });
    }

    window.addEventListener('resize', buildTimelines, { passive: true });
    document.addEventListener('DOMContentLoaded', buildTimelines);

    // Keep nav animation synced with active class updates from section observer.
    var obs = new MutationObserver(syncActivePills);
    links.forEach(function (link) {
        obs.observe(link, { attributes: true, attributeFilter: ['class'] });
    });

    buildTimelines();
})();


/* ── NAV PILL — subtle shrink while scrolling ─────────────── */
(function initNavScroll() {
    var pill = document.getElementById('nav-pill');
    if (!pill) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            pill.style.transform = 'translateX(-50%) scale(0.96)';
            pill.style.boxShadow = '3px 3px 0px rgba(0,0,0,0.55)';
        } else {
            pill.style.transform = 'translateX(-50%) scale(1)';
            pill.style.boxShadow = '4px 4px 0px #0a0a0a';
        }
    }, { passive: true });
})();


/* ── ACTIVE NAV LINK — robust scroll spy ───────────────────── */
(function initActiveNav() {
    var links = Array.from(document.querySelectorAll('.nav-links li a'));
    var sections = Array.from(document.querySelectorAll('section[id]'));
    if (!links.length || !sections.length) return;

    function setActiveById(id) {
        var targetHref = '#' + id;
        links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === targetHref);
        });
    }

    function updateActiveFromScroll() {
        var scrollPos = window.scrollY + 170;
        var currentId = sections[0].id;

        sections.forEach(function (section) {
            if (scrollPos >= section.offsetTop) {
                currentId = section.id;
            }
        });

        setActiveById(currentId);
    }

    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll, { passive: true });
    document.addEventListener('DOMContentLoaded', updateActiveFromScroll);
    updateActiveFromScroll();
})();


/* ── SCROLL-TRIGGERED FADE IN ──────────────────────────────── */
(function initScrollReveal() {
    var targets = document.querySelectorAll(
        '.bento-card, .project-card, .faq-item, .cert-item, .about-grid'
    );
    if (!targets.length) return;

    // Stagger delays for grouped elements
    document.querySelectorAll('.bento-card').forEach(function (el, i) {
        el.style.animationDelay = (i * 0.07) + 's';
    });
    document.querySelectorAll('.project-card').forEach(function (el, i) {
        el.style.animationDelay = (i * 0.1) + 's';
    });
    document.querySelectorAll('.cert-item').forEach(function (el, i) {
        el.style.animationDelay = (i * 0.08) + 's';
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (t) { observer.observe(t); });
})();


/* ── FAQ — prevent default summary toggle jank on fast clicks ─ */
(function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
        var summary = item.querySelector('.faq-summary');
        if (!summary) return;
        // Let native <details> handle open/close;
        // we just ensure smooth icon transition via CSS.
        summary.addEventListener('click', function () {
            // Close others for accordion feel (optional)
            items.forEach(function (other) {
                if (other !== item && other.open) {
                    other.open = false;
                }
            });
        });
    });
})();


/* ── HERO ENTRANCE — stagger left-side children ─────────────── */
(function initHeroEntrance() {
    var heroLeft = document.querySelector('.hero-left');
    if (!heroLeft) return;
    Array.from(heroLeft.children).forEach(function (child, i) {
        child.style.opacity   = '0';
        child.style.transform = 'translateY(24px)';
        child.style.transition =
            'opacity 0.55s ease ' + (0.1 + i * 0.12) + 's, ' +
            'transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) ' + (0.1 + i * 0.12) + 's';
        // Trigger reflow then animate in
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                child.style.opacity   = '1';
                child.style.transform = 'translateY(0)';
            });
        });
    });
})();


/* ── HERO ROLE ROTATOR — dynamic modern subtitle ───────────── */
(function initHeroRoleRotator() {
    var roleEl = document.getElementById('hero-role-text');
    if (!roleEl) return;

    var roles = [
        'devops engineer',
        'cloud architect',
        'full-stack dev',
        'automation-first builder'
    ];

    var idx = 0;
    setInterval(function () {
        roleEl.classList.add('is-swapping');

        setTimeout(function () {
            idx = (idx + 1) % roles.length;
            roleEl.textContent = roles[idx];
            roleEl.classList.remove('is-swapping');
        }, 220);
    }, 2200);
})();
