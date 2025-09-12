/* main.js — cleaned & consolidated for septiahadi.github.io
   Cleanup: removed duplicate inits, dead listeners, and page-agnostic clutter.
   Kept: header shadow, mobile nav, AOS, GLightbox, Typed.js, Isotope filter+sort,
         activity scroller, scroll-top, preloader, footer year, light scrollspy.
*/

/* ===== Helpers ===== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* 1) Header shadow on scroll (.scrolled on <body>) */
(function initScrolledHeader() {
  const header = $("#header");
  if (!header) return;
  const apply = () => {
    if (window.scrollY > 100) document.body.classList.add("scrolled");
    else document.body.classList.remove("scrolled");
  };
  window.addEventListener("load", apply, { once: true });
  document.addEventListener("scroll", apply, { passive: true });
})();

/* 2) Mobile nav toggle */
(function initMobileNav() {
  const btn = $(".mobile-nav-toggle");
  const nav = $("#navmenu");
  if (!btn || !nav) return;

  const icon = btn.querySelector("i");
  const toggle = () => {
    const active = document.body.classList.toggle("mobile-nav-active");
    btn.setAttribute("aria-expanded", active ? "true" : "false");
    if (icon) {
      icon.classList.toggle("bi-list", !active);
      icon.classList.toggle("bi-x", active);
    }
  };
  btn.addEventListener("click", toggle);

  // Close on menu link click (for hash navigation)
  $$("#navmenu a").forEach(a => {
    a.addEventListener("click", () => {
      if (document.body.classList.contains("mobile-nav-active")) toggle();
    });
  });
})();

/* 3) AOS (if loaded) */
(function initAOS() {
  if (typeof AOS === "undefined") return;
  AOS.init({ duration: 600, easing: "ease-out", once: true });
})();

/* 4) GLightbox (if .glightbox exists) */
(function initLightbox() {
  if (typeof GLightbox === "undefined") return;
  if (!$(".glightbox")) return;
  GLightbox({ selector: ".glightbox", touchNavigation: true });
})();

/* 5) Typed.js (index hero only) */
(function initTyped() {
  if (typeof Typed === "undefined") return;
  const el = $(".typed");
  if (!el) return;
  const items = (el.getAttribute("data-typed-items") || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  if (!items.length) return;
  new Typed(".typed", {
    strings: items,
    typeSpeed: 60,
    backSpeed: 30,
    backDelay: 1400,
    loop: true
  });
})();

/* 6) Portfolio filter + SORT newest-first (Isotope) — index only */
(function initPortfolio() {
  const grid = $("#portfolio-grid");
  if (!grid || typeof Isotope === "undefined") return;

  const run = () => {
    const iso = new Isotope(grid, {
      itemSelector: ".portfolio-item",
      layoutMode: "fitRows",
      getSortData: {
        date: el => el.getAttribute("data-date") || ""  // expects YYYY-MM-DD
      },
      sortBy: "date",
      sortAscending: false
    });

    // Bind filters (support both <li> and .filter-btn)
    const buttons = $$(".portfolio-filters .filter-btn, .portfolio-filters li");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "*";
        iso.arrange({ filter, sortBy: "date", sortAscending: false });

        // Active state
        buttons.forEach(el => el.classList.remove("filter-active"));
        btn.classList.add("filter-active");
      });
    });

    // Initial arrange to ensure sorted on load
    iso.arrange({ filter: "*", sortBy: "date", sortAscending: false });
  };

  if (typeof imagesLoaded !== "undefined") {
    imagesLoaded(grid, run);
  } else {
    run();
  }
})();

/* 7) Activity horizontal scroller — index only */
(function initActivityScroller() {
  const scroller = $(".activity-scroller");
  const prev = $(".activity-prev");
  const next = $(".activity-next");
  if (!scroller || !prev || !next) return;

  const step = () => Math.max(200, Math.round(scroller.clientWidth * 0.9));
  prev.addEventListener("click", () => scroller.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => scroller.scrollBy({ left:  step(), behavior: "smooth" }));

  // Keyboard a11y
  scroller.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") scroller.scrollBy({ left:  step(), behavior: "smooth" });
    if (e.key === "ArrowLeft")  scroller.scrollBy({ left: -step(), behavior: "smooth" });
  });
})();

/* 8) Scroll-top button */
(function initScrollTop() {
  const btn = $("#scroll-top") || $(".scroll-top");
  if (!btn) return;
  const onScroll = () => {
    const active = window.scrollY > 100;
    btn.classList.toggle("active", active);
  };
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("load", onScroll, { once: true });
  document.addEventListener("scroll", onScroll, { passive: true });
})();

/* 9) Preloader fade + remove — index only */
(function killPreloader() {
  const pre = $("#preloader");
  if (!pre) return;
  window.addEventListener("load", () => {
    pre.style.opacity = "0";
    setTimeout(() => pre.remove(), 400);
  }, { once: true });
})();

/* 10) Footer year (explicit spans + index copyright placeholder) */
(function setYear() {
  const year = String(new Date().getFullYear());
  $$("#year").forEach(node => (node.textContent = year));
  const copyrightSpan = document.querySelector("footer .copyright span");
  if (copyrightSpan && !copyrightSpan.textContent.trim()) {
    copyrightSpan.textContent = year;
  }
})();

/* 11) Lightweight scrollspy (in-page anchors) */
(function initScrollspy() {
  const links = $$("#navmenu a").filter(a => a.hash && a.hash.startsWith("#"));
  if (!links.length) return;

  const sections = links.map(a => document.querySelector(a.hash)).filter(Boolean);
  if (!sections.length) return;

  const onScroll = () => {
    const pos = window.scrollY + 200;
    let activeId = null;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (pos >= top && pos <= bottom) activeId = "#" + sec.id;
    });
    links.forEach(a => a.classList.toggle("active", a.hash === activeId));
  };

  window.addEventListener("load", onScroll, { once: true });
  document.addEventListener("scroll", onScroll, { passive: true });
})();
