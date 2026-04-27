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
