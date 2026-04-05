// ─── Theme Toggle ───
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('vsdesign-theme') || 'dark';
  root.setAttribute('data-theme', saved);

  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('vsdesign-theme', next);
    });
  }
})();

// ─── Course Tabs ───
const tabs = document.querySelectorAll(".course-tab");
const panels = document.querySelectorAll(".course-panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.course;
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const panel = document.getElementById("panel-" + target);
    if (panel) panel.classList.add("active");
  });
});

const reviews = document.querySelectorAll(".review");
const dots = document.querySelectorAll(".review-dot");
let currentIndex = 0;
let autoplayTimer;

function showReview(idx) {
  reviews.forEach(r => r.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  currentIndex = (idx + reviews.length) % reviews.length;
  if (reviews[currentIndex]) reviews[currentIndex].classList.add("active");
  if (dots[currentIndex]) dots[currentIndex].classList.add("active");
}

function startAutoplay() {
  autoplayTimer = setInterval(() => showReview(currentIndex + 1), 4000);
}

if (reviews.length > 0) {
  showReview(0);
  startAutoplay();

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(autoplayTimer);
      showReview(i);
      startAutoplay();
    });
  });
}

// ─── Contact Form ───
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMessage");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.textContent = "Sending...";
    btn.disabled = true;

    setTimeout(() => {
      formMsg.innerHTML = "✓ &nbsp;Message sent! We'll get back to you within 24 hours.";
      formMsg.style.color = "#00E5FF";
      form.reset();
      btn.textContent = "Send Message";
      btn.disabled = false;
    }, 1200);
  });
}

// ─── Scroll Fade Animations ───
const fadeEls = document.querySelectorAll(".fade-up");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, entry.target.dataset.delay || 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ─── Mobile Nav ───
const hamburger = document.querySelector(".hamburger");
const navEl = document.querySelector("nav");

if (hamburger && navEl) {
  hamburger.addEventListener("click", () => {
    navEl.classList.toggle("open");
    const spans = hamburger.querySelectorAll("span");
    navEl.classList.contains("open")
      ? (spans[0].style.transform = "rotate(45deg) translate(5px, 5px)",
         spans[1].style.opacity = "0",
         spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)")
      : (spans[0].style.transform = "",
         spans[1].style.opacity = "",
         spans[2].style.transform = "");
  });
}

// ─── Header scroll shadow ───
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = "0 4px 30px rgba(0,0,0,0.5)";
  } else {
    header.style.boxShadow = "none";
  }
});