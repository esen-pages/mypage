/* ── Mobile Menu ── */
function toggleMenu() {
    document.getElementById('mobileNav').classList.toggle('open');
}

function closeMenu() {
    document.getElementById('mobileNav').classList.remove('open');
}

/* ── Scroll: Transparent → Solid Header ── */
const header = document.querySelector('header');
const heroSection = document.querySelector('.hero');

function onScroll() {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    header.classList.toggle('scrolled', heroBottom <= 72);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' });
        }
    });
});

/* ────────────────────────────────────────────
   ANIMATION HELPERS
──────────────────────────────────────────── */

/**
 * Fade-in + translate an element via inline transition,
 * then cleans up inline styles so :hover rules work normally.
 * @param {number} dur  transition duration in ms
 */
function animateIn(el, delay, fromTransform, toTransform = '', dur = 900) {
    el.style.opacity = '0';
    el.style.transform = fromTransform;

    setTimeout(() => {
        el.style.transition = `opacity ${dur}ms cubic-bezier(0.16,1,0.3,1), transform ${dur}ms cubic-bezier(0.16,1,0.3,1)`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = toTransform;

            el.addEventListener('transitionend', function cleanup(e) {
                if (e.propertyName !== 'opacity') return;
                el.style.cssText = '';
                el.removeEventListener('transitionend', cleanup);
            });
        }));
    }, delay);
}

/* ── Hero Entrance ── */
(function initHero() {
    const items = [
        document.querySelector('.hero-badge'),
        document.querySelector('.title-top'),
        document.querySelector('.title-bottom'),
        document.querySelector('.hero-subtitle'),
        document.querySelector('.hero-buttons'),
    ];
    items.forEach((el, i) => {
        if (el) animateIn(el, 200 + i * 350, 'translateY(32px)', 'translateY(0)', 1400);
    });

    // Bottom strip items
    document.querySelectorAll('.strip-item').forEach((item, i) => {
        animateIn(item, 1800 + i * 260, 'translateY(24px)', 'translateY(0)', 1200);
    });
})();

/* ── Section Cards Stagger (Solution, Pricing) ── */
function initStagger(groupSelector, cardSelector) {
    const group = document.querySelector(groupSelector);
    if (!group) return;

    new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.unobserve(group);

        group.querySelectorAll(cardSelector).forEach((card, i) => {
            animateIn(card, i * 320, 'translateY(36px)', 'translateY(0)', 1200);
        });
    }, { threshold: 0.1 }).observe(group);
}

initStagger('.pain-cards',    '.pain-card');
initStagger('.solution-grid', '.solution-card');
initStagger('.pricing-grid',  '.pricing-card');

/* ── Google Sheet: Row Slide-in + Sequential Typing ── */
function typeText(el, text, speed) {
    return new Promise(resolve => {
        el.textContent = '';
        el.classList.add('typing-cursor');
        let i = 0;
        const t = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) {
                clearInterval(t);
                // Short pause at end of each cell before moving to next
                setTimeout(() => {
                    el.classList.remove('typing-cursor');
                    resolve();
                }, 280);
            }
        }, speed);
    });
}

const serviceVisual = document.querySelector('.service-visual');
if (serviceVisual) {
    new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.unobserve(serviceVisual);

        const newRow = document.getElementById('new-row');
        const typeCells = newRow ? newRow.querySelectorAll('.type-cell') : [];
        if (!newRow || !typeCells.length) return;

        // Row slides in
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateX(-18px)';
        newRow.style.transition = 'opacity .55s ease, transform .55s ease';

        setTimeout(() => {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateX(0)';
            }));

            // Type each cell in sequence after row settles
            setTimeout(async () => {
                for (const cell of typeCells) {
                    const text = cell.dataset.text;
                    const speed = Math.max(55, Math.round(900 / text.length)); // ~900ms per cell
                    await typeText(cell, text, speed);
                }
            }, 600);
        }, 400);
    }, { threshold: 0.5 }).observe(serviceVisual);
}

/* ── Why Compare: Entrance Animation ── */
(function initWhyCompare() {
    const compare = document.querySelector('.why-compare');
    if (!compare) return;

    const left = compare.querySelector('.why-col-left');
    const right = compare.querySelector('.why-col-right');

    new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.unobserve(compare);
        animateIn(left,  0,   'translateX(-48px)', 'translateX(0)', 900);
        animateIn(right, 0,   'translateX(48px)',  'translateX(0)', 900);
    }, { threshold: 0.2 }).observe(compare);
})();

/* ── Why Stats: Count-Up ── */
(function initCountUp() {
    const stats = document.querySelector('.why-stats');
    if (!stats) return;

    new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.unobserve(stats);

        const durations = [1400, 700, 500];
        stats.querySelectorAll('.why-stat').forEach((stat, i) => {
            const target = parseInt(stat.dataset.count, 10);
            const numEl  = stat.querySelector('.count-num');
            if (!numEl) return;
            const dur = durations[i];
            const t0  = performance.now();
            const tick = (now) => {
                const p = Math.min((now - t0) / dur, 1);
                numEl.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.5 }).observe(stats);
})();

/* ── Template Cards: Independent Auto-Cycle ── */
document.querySelectorAll('.tpl-card').forEach(card => {
    const interval = parseInt(card.dataset.interval, 10) || 3000;
    const slides = card.querySelectorAll('.tpl-slide');
    const dots   = card.querySelectorAll('.tpl-cdot');
    let cur = 0;

    setInterval(() => {
        slides[cur].classList.remove('tpl-slide-active');
        dots[cur].classList.remove('tpl-cdot-active');
        dots[cur].style.width = '';
        dots[cur].style.borderRadius = '';

        cur = (cur + 1) % slides.length;

        slides[cur].classList.add('tpl-slide-active');
        dots[cur].classList.add('tpl-cdot-active');
        dots[cur].style.width = '16px';
        dots[cur].style.borderRadius = '3px';
    }, interval);
});
