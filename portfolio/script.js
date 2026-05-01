// ── 히어로 타이포 너비 자동 맞춤 ──
(function () {
  const el = document.getElementById('hero-typo');
  const wrap = el.parentElement;
  function fit() {
    let lo = 40, hi = 600;
    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      el.scrollWidth <= wrap.clientWidth * .98 ? (lo = mid) : (hi = mid);
    }
    el.style.fontSize = lo + 'px';
  }
  document.fonts.ready.then(fit);
  window.addEventListener('resize', fit);
})();


// ── Nav Dots ──
const wrap  = document.getElementById('wrap');
const dots  = document.querySelectorAll('.dot');
const sects = document.querySelectorAll('#wrap > section');
const DARK  = [3, 5]; // S4 (campus 배경), S6 (blue bg)

function setActive(i) {
  dots.forEach((d, j) => d.classList.toggle('active', i === j));
  document.body.classList.toggle('dark-nav', DARK.includes(i));
}
dots.forEach((d, i) => {
  d.addEventListener('click', () => sects[i].scrollIntoView({ behavior: 'smooth' }));
});
const navIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio >= 0.5)
      setActive(Array.from(sects).indexOf(e.target));
  });
}, { root: wrap, threshold: 0.5 });
sects.forEach(s => navIO.observe(s));


// ── S2 입장 애니메이션 ──
const s2IO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.getElementById('s2').classList.add('s2-animated');
      s2IO.disconnect();
    }
  });
}, { root: wrap, threshold: 0.3 });
s2IO.observe(document.getElementById('s2'));


// ── S3 애니메이션 ──
let s3Done = false;

function countUp(el, target, duration) {
  const step = target / (duration / 16);
  let val = 0;
  const t = setInterval(() => {
    val = Math.min(val + step, target);
    el.textContent = Math.floor(val);
    if (val >= target) clearInterval(t);
  }, 16);
}

const s3IO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !s3Done) {
      s3Done = true;
      document.querySelectorAll('.cc-bar-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 150);
      });
      document.querySelectorAll('.cc-cu-val').forEach((el, i) => {
        setTimeout(() => countUp(el, parseInt(el.dataset.target, 10), 1800), i * 200);
      });
      setTimeout(() => {
        const ring = document.querySelector('.prog-ring');
        if (ring) ring.style.strokeDashoffset = '11';
      }, 400);
      s3IO.disconnect();
    }
  });
}, { root: wrap, threshold: 0.4 });
s3IO.observe(document.getElementById('s3'));


// ── S5 입장 애니메이션 ──
const s5IO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.getElementById('s5').classList.add('s5-animated');
      s5IO.disconnect();
    }
  });
}, { root: wrap, threshold: 0.3 });
s5IO.observe(document.getElementById('s5'));


// ── 상담 폼 제출 (S5) ──
function submitForm() {
  const name = document.getElementById('fn').value.trim();
  const tel  = document.getElementById('ft').value.trim();
  if (!name) { alert('이름을 입력해주세요.'); document.getElementById('fn').focus(); return; }
  if (!tel)  { alert('연락처를 입력해주세요.'); document.getElementById('ft').focus(); return; }
  if (!/^[\d\-\s]{9,14}$/.test(tel)) { alert('올바른 연락처를 입력해주세요.'); return; }
  document.getElementById('s5-form').style.display = 'none';
  document.getElementById('form-ok').style.display  = 'block';
}
