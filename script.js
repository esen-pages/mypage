/* ====================================================
   Sobers Landing Page — GSAP Animations
==================================================== */
gsap.registerPlugin(ScrollTrigger);

/* ====================================================
   Background Boxes — Hero
==================================================== */
(function initHeroBoxes() {
  const container = document.getElementById('hero-boxes');
  if (!container) return;

  const isMobileBoxes = window.innerWidth < 768;
  const COLS = isMobileBoxes ? 30 : 100;
  const ROWS = isMobileBoxes ? 25 : 80;

  const colors = [
    'rgb(125,211,252)',
    'rgb(249,168,212)',
    'rgb(134,239,172)',
    'rgb(253,224,71)',
    'rgb(252,165,165)',
    'rgb(216,180,254)',
    'rgb(147,197,253)',
    'rgb(165,180,252)',
    'rgb(196,181,253)',
  ];

  const plusSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="hero-box-plus"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/></svg>`;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COLS; i++) {
    const col = document.createElement('div');
    col.className = 'hero-box-col';

    for (let j = 0; j < ROWS; j++) {
      const cell = document.createElement('div');
      cell.className = 'hero-box-cell';

      if (i % 2 === 0 && j % 2 === 0) {
        cell.innerHTML = plusSVG;
      }

      cell.addEventListener('mouseenter', () => {
        const c = colors[Math.floor(Math.random() * colors.length)];
        cell.style.backgroundColor = c;
        setTimeout(() => { cell.style.backgroundColor = ''; }, 1000);
      });

      col.appendChild(cell);
    }

    fragment.appendChild(col);
  }

  container.appendChild(fragment);
})();

/* ====================================================
   1. Hero Entrance Animation
==================================================== */
const heroTl = gsap.timeline({ delay: 0.4 });

heroTl
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
document.getElementById("product-card-trigger").style.height = (window.innerHeight * 6) + "px";

// Initial states
gsap.set("#cta-layer", { opacity: 0, scale: 0.88, filter: "blur(20px)", pointerEvents: "none" });

const cardTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#product-card-trigger",
    start: "top top",
    end: () => "+=" + (window.innerHeight * 5.0),
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

  .to({}, { duration: 1.5 })

  // ── Step 3: 아이폰 레이아웃 등장 ────────────────────
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
const quickRotY = phone ? gsap.quickTo(phone, "rotationY", { duration: 1.2, ease: "power3.out" }) : null;
const quickRotX = phone ? gsap.quickTo(phone, "rotationX", { duration: 1.2, ease: "power3.out" }) : null;
let rafId;

window.addEventListener("mousemove", (e) => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (!mainCard) return;
    const rect = mainCard.getBoundingClientRect();
    mainCard.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    mainCard.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    if (quickRotY) {
      quickRotY((e.clientX / window.innerWidth - 0.5) * 20);
      quickRotX((e.clientY / window.innerHeight - 0.5) * -20);
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
   7. Step rows slide-in
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
    'features':          { type: 'target', value: '#features' },
    'how-it-works':      { type: 'target', value: '#how-it-works' },
    'faq':               { type: 'target', value: '#faq' },
    'pricing':           { type: 'target', value: '#pricing' },
    'consulting':        { type: 'target', value: '#consulting' },
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
   10. Pricing Billing Toggle
==================================================== */
(function () {
  let isAnnual = true;

  function update() {
    const btn   = document.getElementById('billing-toggle-btn');
    const thumb = document.getElementById('billing-thumb');
    const val   = document.getElementById('price-value');
    const period= document.getElementById('price-period');
    const orig  = document.getElementById('price-original');
    const lblM  = document.getElementById('billing-label-monthly');
    const lblA  = document.getElementById('billing-label-annual');
    if (!btn) return;

    if (isAnnual) {
      btn.style.background   = 'rgba(59,130,246,0.85)';
      thumb.style.transform  = 'translateX(22px)';
      val.textContent        = '140,000';
      period.textContent     = '연간 1회 결제';
      orig.textContent       = '정가 ₩230,000';
      orig.style.visibility  = 'visible';
      lblM.style.color       = '';
      lblA.style.color       = '#93C5FD';
    } else {
      btn.style.background   = 'rgba(82,82,82,0.6)';
      thumb.style.transform  = 'translateX(2px)';
      val.textContent        = '11,600';
      period.textContent     = '월 환산 기준 (연간 결제 시)';
      orig.textContent       = '정가 약 ₩19,000/월';
      orig.style.visibility  = 'visible';
      lblM.style.color       = '#93C5FD';
      lblA.style.color       = '';
    }
  }

  window.toggleBilling = function () { isAnnual = !isAnnual; update(); };
  window.setBilling    = function (v) { isAnnual = v; update(); };
})();

/* ====================================================
   12. FAQ — Phone mockup chat interface
==================================================== */
(function () {
  const faqData = [
    {
      q: '홈페이지 제작 기간이 얼마나 걸리나요?',
      a: '상담 후 자료를 받은 시점부터 약 <strong style="color:#fff;">7~14일</strong> 이내에 제작이 완료됩니다. 자료를 빠르게 제공해 주시면 더 일찍 완성될 수 있으며, 디자인 수정 횟수에 따라 일정이 조정될 수 있습니다.',
      short: '제작 기간'
    },
    {
      q: '연간 구독 이후 갱신 비용은 얼마인가요?',
      a: '갱신 시에도 동일한 연간 구독료가 적용됩니다. 런칭 기념 특가로 시작하신 고객님은 갱신 시에도 동일한 혜택을 유지해 드립니다. 홈페이지 재제작이 아닌 <strong style="color:#fff;">운영 유지 비용</strong>으로 부담 없이 계속 이용하실 수 있습니다.',
      short: '갱신 비용'
    },
    {
      q: '홈페이지 내용을 수정하고 싶으면 어떻게 하나요?',
      a: '카카오톡으로 수정 내용을 보내주시면 빠르게 반영해 드립니다. 구독 기간 내 <strong style="color:#fff;">월 1회 무료 업데이트</strong>가 포함되어 있으며, 시간표 변경, 공지사항, 이벤트 배너 등 콘텐츠 수정·추가가 가능합니다. 단, <strong style="color:#fff;">디자인을 새롭게 변경하는 작업은 포함되지 않습니다.</strong>',
      short: '내용 수정'
    },
    {
      q: '도메인(인터넷 주소)을 직접 구매해야 하나요?',
      a: '아니요. 도메인 구매부터 서버 설정, 배포까지 <strong style="color:#fff;">모든 과정을 대행</strong>해 드립니다. 원장님은 원하시는 학원 이름이나 주소 형태만 알려주시면 나머지는 저희가 처리합니다.',
      short: '도메인 구매'
    },
    {
      q: '가격이 저렴한 이유가 있나요?',
      a: 'SubWeb은 불필요한 기능을 뺀 1페이지의 <strong style="color:#fff;">랜딩 페이지</strong>를 전문적으로 제작합니다. 한 가지에만 집중하기 때문에 제작 과정이 철저히 <strong style="color:#fff;">표준화</strong>되어 있고, 그 효율이 그대로 가격에 반영됩니다.',
      short: '저렴한 가격'
    },
    {
      q: '기능 추가는 어떻게 하나요?',
      a: '<strong style="color:#fff;">모바일 반응형</strong>은 기본 플랜에 무료로 포함됩니다. <strong style="color:#fff;">구글 시트 연동</strong>(상담 신청 정보 자동 수집)은 일회성 비용 <strong style="color:#fff;">+1만원</strong>으로 추가하실 수 있습니다.',
      short: '기능 추가'
    }
  ];

  let current  = -1;
  let animating = false;

  const qRow      = document.getElementById('faq-phone-q');
  const aRow      = document.getElementById('faq-phone-a');
  const qText     = document.getElementById('faq-question-text');
  const aText     = document.getElementById('faq-answer-text');
  const accordion = document.getElementById('faq-accordion');
  const msgs      = document.querySelector('.faq-messages');

  if (!accordion) return;

  // Build accordion items — short title row + full question as expandable body
  faqData.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'faq-acc-item';
    el.innerHTML =
      `<button class="faq-acc-q" type="button">` +
        `<span>${item.short}</span>` +
        `<svg class="faq-acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
          `<path d="M6 9l6 6 6-6"/>` +
        `</svg>` +
      `</button>` +
      `<div class="faq-acc-body"><p>${item.q}</p></div>`;

    el.querySelector('.faq-acc-q').addEventListener('click', () => {
      accordion.querySelectorAll('.faq-acc-item.faq-acc-open').forEach(x => x.classList.remove('faq-acc-open'));
      el.classList.add('faq-acc-open');
      showFaq(i);
    });

    accordion.appendChild(el);
  });

  // Typewriter for HTML strings with <strong> support
  function typeHtml(el, html, onDone) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const chars = [];
    temp.childNodes.forEach(node => {
      if (node.nodeType === 3) {
        [...node.textContent].forEach(ch => chars.push({ ch, tag: null, style: '' }));
      } else if (node.nodeName === 'STRONG') {
        const style = node.getAttribute('style') || '';
        [...node.textContent].forEach(ch => chars.push({ ch, tag: 'strong', style }));
      }
    });

    function buildHtml(upTo, withCursor) {
      let out = ''; let prevTag = null;
      for (let j = 0; j < upTo; j++) {
        const c = chars[j];
        if (c.tag !== prevTag) {
          if (prevTag === 'strong') out += '</strong>';
          if (c.tag === 'strong') out += `<strong style="${c.style}">`;
          prevTag = c.tag;
        }
        out += c.ch;
      }
      if (prevTag === 'strong') out += '</strong>';
      if (withCursor) out += '<span class="faq-cursor">▋</span>';
      return out;
    }

    let i = 0;
    el.innerHTML = '<span class="faq-cursor">▋</span>';
    function tick() {
      i++;
      el.innerHTML = buildHtml(i, i < chars.length);
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
      if (i < chars.length) {
        const ch = chars[i - 1].ch;
        setTimeout(tick, (ch === '.' || ch === ',') ? 55 : 20);
      } else {
        if (onDone) onDone();
      }
    }
    setTimeout(tick, 0);
  }

  function showFaq(index) {
    if (animating) return;
    animating = true;
    current = index;

    // 사용자 질문 버블 생성
    const newQRow = document.createElement('div');
    newQRow.className = 'faq-user-row faq-msg-appear';
    newQRow.innerHTML = `<div class="faq-user-bubble"><p class="faq-bubble-text">${faqData[index].q}</p></div>`;
    msgs.appendChild(newQRow);
    msgs.scrollTop = msgs.scrollHeight;

    // 답변 버블 생성 (타이핑 표시)
    setTimeout(() => {
      const newARow = document.createElement('div');
      newARow.className = 'faq-bot-row faq-msg-appear';
      newARow.innerHTML =
        `<div class="faq-msg-avatar">SW</div>` +
        `<div class="faq-bot-bubble"><p class="faq-bubble-text"></p></div>`;
      msgs.appendChild(newARow);
      msgs.scrollTop = msgs.scrollHeight;

      const newAText = newARow.querySelector('.faq-bubble-text');
      newAText.innerHTML = '<span class="faq-typing-dots"><span></span><span></span><span></span></span>';

      setTimeout(() => {
        typeHtml(newAText, faqData[index].a, () => { animating = false; });
      }, 650);
    }, 300);
  }

  // Init — 템플릿 행 숨김
  qRow.classList.add('faq-msg-out');
  aRow.classList.add('faq-msg-out');
}());

/* ====================================================
   13. Consulting Form Submission — Google Sheets 연동
   ⚠️  설정: Google Apps Script 배포 후 아래 URL을 교체하세요.
       배포 주소 형식: https://script.google.com/macros/s/.../exec
==================================================== */
(function () {
  const form = document.getElementById('consulting-form');
  if (!form) return;

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbCh3P13FygLsDULPnHIHtdLZlzN_Ej9J6gdCaorQrSRA8YVDkhqTvVcN9JY98GYovBg/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('form-submit-btn');
    const originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span style="opacity:0.7">전송 중...</span>';

    // FormData → 일반 객체로 변환 후 JSON 전송
    const payload = {};
    new FormData(form).forEach((val, key) => { payload[key] = val; });
    // 체크박스는 미체크 시 FormData에서 누락되므로 명시적으로 값 세팅
    // 앱스 스크립트가 truthy/falsy로 판단하므로: 체크=value, 미체크=''
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      payload[cb.name] = cb.checked ? cb.value : '';
    });

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        // Apps Script는 no-cors 환경에서 CORS 헤더를 내려주지 않으므로
        // mode:'no-cors'로 요청하고 응답 본문 대신 타임아웃으로 성공 판단
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      // no-cors 특성상 res.ok를 확인할 수 없어 요청 완료 자체를 성공으로 처리
      form.style.display = 'none';
      document.getElementById('form-success').classList.remove('hidden');
    } catch {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
      alert('전송 중 오류가 발생했습니다. 카카오톡으로 문의해 주세요.');
    }
  });
})();

/* ====================================================
   14. Slide Text — Why Homepage
==================================================== */
(function () {
  const words = [
    "학원을 소개하세요.",
    "전문성을 보여주세요.",
    "소식을 알리세요.",
  ];

  const textA = document.getElementById("slide-text-a");
  const textB = document.getElementById("slide-text-b");
  if (!textA || !textB) return;

  const DURATION = 650;
  const HOLD_MS  = 3800;
  const EASING   = "cubic-bezier(0.77, 0, 0.175, 1)";

  let wordIndex  = 0;
  let isAnimating = false;
  let intervalId  = null;

  textA.textContent = words[0];

  function transition() {
    if (isAnimating) return;
    isAnimating = true;

    const nextIndex = (wordIndex + 1) % words.length;
    const nextWord  = words[nextIndex];

    textB.textContent = nextWord;
    textB.style.transition = "none";
    textB.style.transform  = "translateY(100%)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t = `transform ${DURATION}ms ${EASING}`;
        textA.style.transition = t;
        textB.style.transition = t;
        textA.style.transform  = "translateY(-100%)";
        textB.style.transform  = "translateY(0%)";

        setTimeout(() => {
          wordIndex = nextIndex;
          textA.style.transition = "none";
          textA.style.transform  = "translateY(0)";
          textA.textContent      = nextWord;
          textB.style.transition = "none";
          textB.style.transform  = "translateY(100%)";
          isAnimating = false;
        }, DURATION + 50);
      });
    });
  }

  ScrollTrigger.create({
    trigger: "#product-card-trigger",
    start: () => "+=" + (window.innerHeight * 1.0),
    once: true,
    onEnter: () => {
      if (!intervalId) intervalId = setInterval(transition, HOLD_MS);
    },
  });
})();

// FAQ phone — scroll entrance + mouse tilt
(function () {
  const section = document.getElementById('faq');
  const wrapper = document.getElementById('faq-phone-wrapper');
  const frame   = document.getElementById('faq-phone-frame');
  if (!section || !frame) return;

  // Initial hidden state
  gsap.set(wrapper, { opacity: 0, x: 90 });

  // Scroll entrance: slide in from right
  gsap.to(wrapper, {
    scrollTrigger: {
      trigger: section,
      start: 'top 45%',
      toggleActions: 'play none none none'
    },
    opacity: 1,
    x: 0,
    duration: 1.8,
    ease: 'power3.out'
  });

  // Mouse tilt
  gsap.set(frame, { transformPerspective: 1000, transformOrigin: 'center center' });
  const rotY = gsap.quickTo(frame, 'rotationY', { duration: 1.2, ease: 'power3.out' });
  const rotX = gsap.quickTo(frame, 'rotationX', { duration: 1.2, ease: 'power3.out' });

  let overPhone = false;
  wrapper.addEventListener('mouseenter', () => { overPhone = true; rotY(0); rotX(0); });
  wrapper.addEventListener('mouseleave', () => { overPhone = false; });

  section.addEventListener('mousemove', (e) => {
    if (overPhone) return;
    rotY((e.clientX / window.innerWidth  - 0.5) * 8.5);
    rotX((e.clientY / window.innerHeight - 0.5) * -8.5);
  });

  section.addEventListener('mouseleave', () => {
    rotY(0);
    rotX(0);
  });
}());

// Consulting — tablet scroll-driven 3D tilt (ContainerScroll)
(function () {
  const scroll  = document.getElementById('consulting-scroll');
  const tablet  = document.getElementById('consulting-tablet');
  const header  = document.getElementById('consulting-header');
  if (!scroll || !tablet) return;

  if (window.innerWidth < 768) {
    gsap.set(tablet, { rotationX: 0, scale: 1 });
    return;
  }

  gsap.set(tablet, {
    rotationX: 20,
    scale: 1.05,
    transformPerspective: 1200,
    transformOrigin: 'center top',
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scroll,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
    }
  });

  tl.to(tablet, { rotationX: 0, scale: 1, y: -40, ease: 'none', duration: 1 }, 0);
  if (header) tl.to(header, { y: -50, ease: 'none', duration: 1 }, 0);
  tl.to({}, { duration: 0.5 }); // hold — tablet stays flat while user scrolls
}());

// Spotlight follow effect — pricing card
(function () {
  const card = document.getElementById('pricing-spotlight-card');
  if (!card) return;
  document.addEventListener('pointermove', (e) => {
    card.style.setProperty('--x', e.clientX.toFixed(1));
    card.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(3));
    card.style.setProperty('--y', e.clientY.toFixed(1));
    card.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(3));
  });
}());
