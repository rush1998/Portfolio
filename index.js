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


/* ── HERO CURSOR GLOW ──────────────────────────────────────── */
(function initHeroCursorGlow() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return;

    var glow = document.createElement('div');
    glow.className = 'hero-cursor-glow';
    hero.appendChild(glow);

    var mouseX = 0, mouseY = 0;
    var glowX = 0, glowY = 0;
    var rafId = null;
    var isInside = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateGlow() {
        glowX = lerp(glowX, mouseX, 0.1);
        glowY = lerp(glowY, mouseY, 0.1);
        glow.style.left = glowX + 'px';
        glow.style.top  = glowY + 'px';
        if (isInside) rafId = requestAnimationFrame(animateGlow);
    }

    hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        if (!isInside) {
            isInside = true;
            glowX = mouseX;
            glowY = mouseY;
            glow.classList.add('visible');
            rafId = requestAnimationFrame(animateGlow);
        }
    }, { passive: true });

    hero.addEventListener('mouseleave', function () {
        isInside = false;
        glow.classList.remove('visible');
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }, { passive: true });
})();


/* ── MEDIUM BLOGS GALLERY — horizontal scrollable card deck ───────────── */
(function initBlogsGallery() {
    var gallery = document.getElementById('blogsGallery');
    var scrollLeftBtn = document.getElementById('blogsScrollLeft');
    var scrollRightBtn = document.getElementById('blogsScrollRight');
    
    if (!gallery) return;

    var feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rushpatel';
    var scrollAmount = 380; // Card width + gap

    function fetchBlogs() {
        fetch(feedUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    var articles = data.items.slice(0, 6);
                    renderCards(articles);
                } else {
                    gallery.innerHTML = '<div class="blogs-loading">No articles found yet.</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching Medium feed:', error);
                gallery.innerHTML = '<div class="blogs-loading">Unable to load articles. Please check back later.</div>';
            });
    }

    function createCard(article) {
        var cleanDescription = article.description
            .replace(/<[^>]*>/g, '')
            .slice(0, 100);

        // Extract image from article content if available
        var imageMatch = article.description && article.description.match(/<img[^>]+src=["']([^"']+)["']/);
        var imageUrl = imageMatch ? imageMatch[1] : 'https://via.placeholder.com/350x200?text=' + encodeURIComponent(article.title.slice(0, 20));

        // Default category based on keywords (could be enhanced)
        var categories = ['article', 'insights'];
        if (article.title.toLowerCase().includes('devops')) categories.push('devops');
        if (article.title.toLowerCase().includes('kubernetes')) categories.push('k8s');
        if (article.title.toLowerCase().includes('cloud')) categories.push('cloud');
        categories = categories.slice(-2); // Keep last 2

        var card = document.createElement('div');
        card.className = 'blog-card project-card';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${article.title}" class="blog-card-image project-img" loading="lazy" decoding="async">
            
            <div class="blog-card-content project-info">
                <h3 class="blog-card-title project-title">${article.title}</h3>
                <p class="blog-card-description project-desc">${cleanDescription}...</p>
                
                <div class="blog-card-tags project-tags">
                    ${categories.map(cat => `<span class="project-tag">${cat}</span>`).join('')}
                </div>
                
                <div class="blog-card-footer project-btns">
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="btn-brutal btn-brutal--black">
                        read article
                    </a>
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="btn-brutal btn-brutal--white">
                        medium
                    </a>
                </div>
            </div>
        `;

        return card;
    }

    function renderCards(articles) {
        gallery.innerHTML = '';
        articles.forEach(function(article) {
            gallery.appendChild(createCard(article));
        });
        updateScrollButtons();
    }

    function updateScrollButtons() {
        var scrollLeft = gallery.scrollLeft;
        var scrollWidth = gallery.scrollWidth;
        var clientWidth = gallery.clientWidth;

        // Disable left button if at start
        if (scrollLeftBtn) {
            scrollLeftBtn.disabled = scrollLeft === 0;
        }

        // Disable right button if at end
        if (scrollRightBtn) {
            scrollRightBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 10;
        }
    }

    function scroll(direction) {
        var currentScroll = gallery.scrollLeft;
        var targetScroll = currentScroll + (direction === 'left' ? -scrollAmount : scrollAmount);
        
        gsap.to(gallery, {
            scrollLeft: targetScroll,
            duration: 0.6,
            ease: 'power2.inOut',
            onUpdate: updateScrollButtons
        });
    }

    // Event listeners
    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', function() {
            scroll('left');
        });
    }

    if (scrollRightBtn) {
        scrollRightBtn.addEventListener('click', function() {
            scroll('right');
        });
    }

    gallery.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons, { passive: true });

    // Fetch blogs when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchBlogs);
    } else {
        fetchBlogs();
    }
})();
