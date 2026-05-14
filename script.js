/* ====================================================
   Sobers Landing Page — GSAP Animations
==================================================== */
gsap.registerPlugin(ScrollTrigger);

/* ====================================================
   1. Hero Entrance Animation
==================================================== */
const heroTl = gsap.timeline({ delay: 0.4 });

heroTl
  .to("#tagline1", {
    opacity: 1, y: 0,
    duration: 1.6,
    ease: "expo.out",
    from: { y: 60, filter: "blur(20px)" }
  })
  .fromTo("#tagline1",
    { opacity: 0, y: 60, filter: "blur(20px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "expo.out" }, 0
  )
  .fromTo("#tagline2",
    { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power4.inOut" }, "-=0.8"
  )
  .to("#scroll-hint", { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.2");

/* ====================================================
   2. Pinned Product Card Scroll Sequence
==================================================== */
const isMobile = window.innerWidth < 768;
const cardW = isMobile ? "92vw" : "85vw";
const cardH = isMobile ? "92vh" : "85vh";
const cardR  = isMobile ? "32px" : "40px";

// Trigger height = 7 screens worth of scroll content
document.getElementById("product-card-trigger").style.height = (window.innerHeight * 8) + "px";

// Initial states
gsap.set("#cta-layer", { opacity: 0, scale: 0.88, filter: "blur(20px)", pointerEvents: "none" });
gsap.set("#card-trust-layer", { opacity: 0 });
gsap.set(["#compare-left-col", "#vs-col", "#compare-right-col"], { opacity: 0, y: 36 });

const cardTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#product-card-trigger",
    start: "top top",
    end: () => "+=" + (window.innerHeight * 7.0),
    pin: "#product-card-pin",
    scrub: 1.2,
    anticipatePin: 1,
  }
});

cardTl
  // ── Step 1: 히어로 블러, 카드 등장 (rounded) ──────────
  .to(["#hero-text", ".bg-grid"],
    { scale: 1.1, filter: "blur(16px)", opacity: 0.15, duration: 1.4, ease: "power2.inOut" }, 0
  )
  .to("#main-card",
    { y: 0, opacity: 1, duration: 0.9, ease: "power3.inOut" }, 0
  )

  // ── Step 2: 카드 풀스크린 확장 ───────────────────────
  .to("#main-card",
    { width: "100%", height: "100%", borderRadius: "0px", duration: 0.7, ease: "power3.inOut" }
  )

  // ── Step 3: 신뢰의 간극 텍스트 페이드인 ─────────────
  .to("#card-trust-layer",
    { opacity: 1, duration: 1, ease: "power2.out" }
  )
  .to(["#compare-left-col", "#compare-right-col"],
    { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }, "-=0.4"
  )
  .to("#vs-col",
    { opacity: 1, y: 0, duration: 0.7, ease: "back.out(2)" }, "-=0.9"
  )

  // Hold — 텍스트 읽을 시간
  .to({}, { duration: 2.5 })

  // ── Step 4: 신뢰의 간극 텍스트 사라짐 ───────────────
  .to(["#compare-left-col", "#vs-col", "#compare-right-col"],
    { opacity: 0, y: -20, duration: 0.6, stagger: 0.08, ease: "power2.in" }, "trustOut"
  )
  .to("#trust-heading",
    { opacity: 0, y: -30, duration: 0.8, ease: "power2.in" }, "trustOut+=0.1"
  )
  .to("#card-trust-layer",
    { opacity: 0, duration: 0.5, ease: "power2.in" }, "trustOut+=0.6"
  )

  // ── Step 5: 아이폰 레이아웃 등장 ────────────────────
  .fromTo("#phone-wrapper",
    { y: 200, scale: 0.6, rotationX: 40, opacity: 0 },
    { y: 0, scale: 1, rotationX: 0, opacity: 1, duration: 2, ease: "expo.out" }, "-=0.2"
  )
  .to(".phone-widget", {
    opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "back.out(1.2)"
  }, "-=1.2")
  .to(".progress-ring", {
    strokeDashoffset: 60, duration: 2, ease: "power3.inOut"
  }, "-=1.5")
  .to(".counter-val", {
    innerHTML: 365, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out"
  }, "<")
  .fromTo(".floating-badge",
    { y: 60, opacity: 0, scale: 0.7, rotationZ: -8 },
    { y: 0, opacity: 1, scale: 1, rotationZ: 0, duration: 1.5, stagger: 0.2, ease: "back.out(1.5)" }, "-=1.8"
  )
  .fromTo("#card-text-right",
    { x: 40, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "<"
  )

  // Brief pause before badge phases
  .to({}, { duration: 0.5 })

  // ── Badge Phase 1: 1 Year Streak ─────────────────────
  .to("#badge-1", {
    scale: 1.22,
    filter: "brightness(1.28) drop-shadow(0 0 18px rgba(59,130,246,0.65))",
    duration: 0.8, ease: "back.out(1.2)"
  }, "bp1")
  .to(["#badge-2", "#badge-3"], {
    opacity: 0.3, scale: 0.88,
    filter: "brightness(0.65)",
    duration: 0.6, ease: "power2.out"
  }, "bp1")
  .fromTo("#card-text-left",
    { x: -40, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.9, ease: "power4.out" }, "bp1"
  )
  .to({}, { duration: 1.6 })

  // ── Badge Phase 2: Sponsor Update ────────────────────
  .to("#badge-1", {
    scale: 0.88, opacity: 0.3,
    filter: "brightness(0.65)",
    duration: 0.6, ease: "power2.out"
  }, "bp2")
  .to("#badge-2", {
    scale: 1.22, opacity: 1,
    filter: "brightness(1.28) drop-shadow(0 0 18px rgba(99,102,241,0.65))",
    duration: 0.8, ease: "back.out(1.2)"
  }, "bp2")
  .to("#left-state-1", { opacity: 0, duration: 0.35, ease: "power2.in" }, "bp2")
  .to("#left-state-2", { opacity: 1, duration: 0.5, ease: "power2.out" }, "bp2+=0.3")
  .to({}, { duration: 1.6 })

  // ── Badge Phase 3: Daily Check-in ────────────────────
  .to("#badge-2", {
    scale: 0.88, opacity: 0.3,
    filter: "brightness(0.65)",
    duration: 0.6, ease: "power2.out"
  }, "bp3")
  .to("#badge-3", {
    scale: 1.22, opacity: 1,
    filter: "brightness(1.28) drop-shadow(0 0 18px rgba(16,185,129,0.65))",
    duration: 0.8, ease: "back.out(1.2)"
  }, "bp3")
  .to("#left-state-2", { opacity: 0, duration: 0.35, ease: "power2.in" }, "bp3")
  .to("#left-state-3", { opacity: 1, duration: 0.5, ease: "power2.out" }, "bp3+=0.3")
  .to({}, { duration: 1.6 })

  // ── Step 6: 아이폰 레이아웃 사라짐, CTA 등장 ────────
  .to(["#phone-wrapper", ".floating-badge", "#card-text-left", "#card-text-right"], {
    opacity: 0, y: -20, duration: 0.8, stagger: 0.06, ease: "power2.in"
  }, "fadeSwitch")
  .to("#cta-layer", {
    opacity: 1, pointerEvents: "auto", scale: 1, filter: "blur(0px)",
    duration: 1.2, ease: "expo.out", delay: 0.3
  }, "fadeSwitch")
  .to({}, { duration: 1.5 })

  // ── Step 7: 카드 축소 후 퇴장 ───────────────────────
  .to("#main-card", {
    width: cardW, height: cardH, borderRadius: cardR,
    duration: 1.8, ease: "expo.inOut"
  }, "pullback")
  .to({}, { duration: 1.5 })
  .to("#cta-layer", { opacity: 0, duration: 0.6, ease: "power2.in" }, "exit")
  .to("#main-card", {
    y: -window.innerHeight - 200, opacity: 0,
    duration: 1.2, ease: "power3.in"
  }, "exit");

/* ====================================================
   3. Mouse Parallax on Card
==================================================== */
const mainCard = document.getElementById("main-card");
const phone = document.getElementById("phone");
let rafId;

window.addEventListener("mousemove", (e) => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (!mainCard) return;
    const rect = mainCard.getBoundingClientRect();
    mainCard.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    mainCard.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);

    if (phone) {
      const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
      const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(phone, {
        rotationY: xVal * 10,
        rotationX: -yVal * 10,
        ease: "power3.out",
        duration: 1.2
      });
    }
  });
});

/* ====================================================
   4. Scroll Reveal for all .reveal-block elements
==================================================== */
document.querySelectorAll(".reveal-block").forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none"
    },
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay: (i % 3) * 0.08,
    ease: "power3.out"
  });
});

/* ====================================================
   5. Stat Counter Animation
==================================================== */
document.querySelectorAll(".stat-number").forEach((el) => {
  const target = parseInt(el.dataset.target, 10);
  const suffix = target >= 1000 ? "+" : (el.dataset.suffix || "");

  ScrollTrigger.create({
    trigger: el,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(el, {
        innerHTML: target,
        snap: { innerHTML: target > 100 ? 100 : 1 },
        duration: 2,
        ease: "expo.out",
        onUpdate: function () {
          const v = Math.round(parseFloat(el.innerHTML));
          if (target >= 1000) {
            el.textContent = (v / 1000).toFixed(v >= 1000 ? 0 : 1) + "K+";
          } else if (el.dataset.suffix) {
            el.textContent = v + el.dataset.suffix;
          } else {
            el.textContent = v + suffix;
          }
        }
      });
    }
  });
});

/* ====================================================
   6. Feature card stagger reveal
==================================================== */
gsap.utils.toArray(".feature-card").forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 50 },
    {
      scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
      opacity: 1, y: 0,
      duration: 0.8,
      delay: (i % 3) * 0.12,
      ease: "power3.out"
    }
  );
});

/* ====================================================
   7. Testimonial card stagger
==================================================== */
gsap.utils.toArray(".testimonial-card").forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 40 },
    {
      scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
      opacity: 1, y: 0,
      duration: 0.7,
      delay: (i % 3) * 0.1,
      ease: "power3.out"
    }
  );
});

/* ====================================================
   8. Step rows slide-in
==================================================== */
gsap.utils.toArray(".step-row").forEach((row, i) => {
  gsap.fromTo(row,
    { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
    {
      scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none none" },
      opacity: 1, x: 0,
      duration: 0.9,
      ease: "power3.out"
    }
  );
});

/* ====================================================
   9. Bottom Navigation Bar
==================================================== */
(function () {
  const allNavBtns = document.querySelectorAll('.nav-btn');
  const navBtns    = document.querySelectorAll('.nav-btn[data-target]');

  // Hidden during card section, appears at Features
  gsap.set('#nav-wrapper', { opacity: 0, y: 16, pointerEvents: 'none' });

  ScrollTrigger.create({
    trigger: '#features',
    start: 'top 80%',
    onEnter: () => gsap.to('#nav-wrapper', {
      opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.6, ease: 'power3.out'
    }),
    onLeaveBack: () => gsap.to('#nav-wrapper', {
      opacity: 0, y: 16, pointerEvents: 'none', duration: 0.35, ease: 'power2.in'
    }),
  });

  // Click: scroll to section + set active
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector(btn.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
      allNavBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Scroll-spy: section id → which nav button becomes active
  const sectionNavMap = {
    'features':     { type: 'target',  value: '#features' },
    'how-it-works': { type: 'target',  value: '#how-it-works' },
    'pricing':      { type: 'target',  value: '#pricing' },
    'footer-cta':   { type: 'section', value: 'footer-cta' },
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const map = sectionNavMap[entry.target.id];
      allNavBtns.forEach(btn => {
        const match = map.type === 'target'
          ? btn.dataset.target  === map.value
          : btn.dataset.section === map.value;
        btn.classList.toggle('active', match);
      });
    });
  }, { threshold: 0.35 });

  Object.keys(sectionNavMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

/* ====================================================
   10. Typewriter — Why Homepage
==================================================== */
(function () {
  const words = [
    "검색은 블로그에서, 확신은 홈페이지에서.",
    "홈페이지가 없으면 신뢰도 멈춰있습니다.",
    "넘기는 피드보다 머무는 페이지의 힘.",
  ];

  const textEl   = document.getElementById("typewriter-text");
  const cursorEl = document.getElementById("typewriter-cursor");
  if (!textEl || !cursorEl) return;

  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let timer      = null;

  const SPEED_TYPE   = 85;
  const SPEED_DELETE = 30;
  const HOLD_MS      = 3800;
  const NEXT_WORD_MS = 400;

  function tick() {
    const word = words[wordIndex];

    if (!isDeleting) {
      charIndex++;
      textEl.textContent = word.substring(0, charIndex);

      if (charIndex === word.length) {
        timer = setTimeout(() => { isDeleting = true; tick(); }, HOLD_MS);
        return;
      }
      timer = setTimeout(tick, SPEED_TYPE);
    } else {
      charIndex--;
      textEl.textContent = word.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        timer = setTimeout(tick, NEXT_WORD_MS);
        return;
      }
      timer = setTimeout(tick, SPEED_DELETE);
    }
  }

  /* 커서 깜빡임 */
  setInterval(() => {
    cursorEl.style.opacity = cursorEl.style.opacity === "0" ? "1" : "0";
  }, 520);

  /* trust layer가 실제로 화면에 들어올 때 시작 */
  ScrollTrigger.create({
    trigger: "#product-card-trigger",
    start: () => "+=" + (window.innerHeight * 1.0),
    once: true,
    onEnter: () => { if (!timer) tick(); },
  });
})();
