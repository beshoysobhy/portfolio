// Portfolio JS: theme toggle, mobile nav, scroll-spy, contact form (mailto)
(() => {
  const root = document.documentElement;

  // Theme
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  } else {
    // default: dark
    root.setAttribute("data-theme", "dark");
  }

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");

  function refreshThemeIcon() {
    const t = root.getAttribute("data-theme");
    if (themeIcon) themeIcon.textContent = (t === "light") ? "☀" : "☾";
  }
  refreshThemeIcon();

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    refreshThemeIcon();
  });

  // Mobile nav
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu on link click (mobile)
  navMenu?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll-spy
  const sections = ["about","skills","projects","experience","contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const links = Array.from(document.querySelectorAll(".nav-link"));
  const linkById = new Map();
  links.forEach(l => {
    const href = l.getAttribute("href") || "";
    const id = href.startsWith("#") ? href.slice(1) : "";
    if (id) linkById.set(id, l);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.remove("active"));
        linkById.get(id)?.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.1 });

  sections.forEach(s => obs.observe(s));

  // Contact form -> mailto
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();

    const to = "your.email@example.com"; // TODO: replace
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
