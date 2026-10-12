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

// ─── Automatic Image Showcase ───
(function () {
  const slider = document.querySelector(".showcase-slider");
  if (!slider) return;

  const slidesEl = slider.querySelector(".showcase-slides");
  const dotsEl = slider.querySelector(".showcase-dots");
  const currentEl = slider.querySelector(".showcase-current");
  const totalEl = slider.querySelector(".showcase-total");
  const imageCount = 18;
  const slides = Array.from({ length: imageCount }, (_, index) => `assets/img${index + 1}.jpeg`);
  let current = 0;
  let autoplayTimer;
  let touchStartX = 0;

  slides.forEach((source, index) => {
    const slide = document.createElement("div");
    slide.className = "showcase-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} of ${imageCount}`);
    const image = document.createElement("img");
    image.src = source;
    image.alt = `VS Design training and project showcase image ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    slide.appendChild(image);
    slidesEl.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "showcase-dot";
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show image ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartAutoplay();
    });
    dotsEl.appendChild(dot);
  });

  totalEl.textContent = String(imageCount).padStart(2, "0");

  function showSlide(index) {
    current = (index + imageCount) % imageCount;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    currentEl.textContent = String(current + 1).padStart(2, "0");
    slider.querySelectorAll(".showcase-dot").forEach((dot, dotIndex) => {
      const isActive = dotIndex === current;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  }

  function startAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => showSlide(current + 1), 3800);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  slider.querySelector(".showcase-prev").addEventListener("click", () => {
    showSlide(current - 1);
    restartAutoplay();
  });
  slider.querySelector(".showcase-next").addEventListener("click", () => {
    showSlide(current + 1);
    restartAutoplay();
  });
  slider.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("focusin", () => clearInterval(autoplayTimer));
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget)) startAutoplay();
  });
  slider.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    clearInterval(autoplayTimer);
  }, { passive: true });
  slider.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showSlide(current + (distance < 0 ? 1 : -1));
    startAutoplay();
  }, { passive: true });

  showSlide(0);
  startAutoplay();
})();

// ─── Batch & Workshop Photo Slideshows ───
document.querySelectorAll(".gallery-slideshow").forEach((slideshow) => {
  const track = slideshow.querySelector(".gallery-slideshow-track");
  const slides = track ? track.querySelectorAll(".gallery-slideshow-slide") : [];
  if (slides.length < 2) return;

  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  function startAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 4000);
  }

  slideshow.addEventListener("mouseenter", () => clearInterval(timer));
  slideshow.addEventListener("mouseleave", startAutoplay);
  showSlide(0);
  startAutoplay();
});

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
