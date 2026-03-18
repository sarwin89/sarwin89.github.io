document.addEventListener("DOMContentLoaded", () => {
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const savedTheme = window.localStorage.getItem("sarwinTheme") || preferredTheme;

  applyTheme(savedTheme);
  setupThemeToggle();
  setupDrawer();
  highlightCurrentPage();
  setupSectionNav();
  setupReveal();
  setupViewer();
  updateYear();
});

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  const themeLabel = nextTheme === "dark" ? "Switch to paper mode" : "Switch to midnight mode";
  const themeState = nextTheme === "dark" ? "Midnight" : "Paper";

  document.documentElement.setAttribute("data-theme", nextTheme);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", themeLabel);
    button.setAttribute("title", themeLabel);
  });

  document.querySelectorAll("[data-theme-label]").forEach((node) => {
    node.textContent = themeLabel;
  });

  document.querySelectorAll("[data-theme-state]").forEach((node) => {
    node.textContent = themeState;
  });
}

function setupThemeToggle() {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);
      window.localStorage.setItem("sarwinTheme", nextTheme);
    });
  });
}

function setupDrawer() {
  const body = document.body;
  const toggle = document.querySelector("[data-menu-toggle]");
  const closeTargets = document.querySelectorAll("[data-drawer-close], .site-nav a");
  const desktopMedia = window.matchMedia("(min-width: 75rem)");

  if (!toggle) {
    return;
  }

  const closeDrawer = () => {
    body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  closeTargets.forEach((target) => {
    target.addEventListener("click", () => {
      if (!desktopMedia.matches) {
        closeDrawer();
      }
    });
  });

  desktopMedia.addEventListener("change", (event) => {
    if (event.matches) {
      closeDrawer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
}

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("is-current");
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupSectionNav() {
  const nav = document.querySelector("[data-page-nav]");
  if (!nav) {
    return;
  }

  const links = Array.from(nav.querySelectorAll("a[href^='#']"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (!("IntersectionObserver" in window)) {
    setActive(sections[0].id);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.1, 0.3, 0.6]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupReveal() {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!items.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12
    }
  );

  items.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

function setupViewer() {
  const viewer = document.querySelector("[data-viewer]");
  const triggers = Array.from(document.querySelectorAll("[data-lightbox-trigger]"));

  if (!viewer || !triggers.length) {
    return;
  }

  const image = viewer.querySelector("[data-viewer-image]");
  const title = viewer.querySelector("[data-viewer-title]");
  const description = viewer.querySelector("[data-viewer-description]");
  const closeButton = viewer.querySelector("[data-viewer-close]");
  let lastTrigger = null;

  const closeViewer = () => {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      lastTrigger = trigger;
      image.src = trigger.dataset.image || "";
      image.alt = trigger.dataset.alt || "";
      title.textContent = trigger.dataset.title || "Archive image";
      description.textContent = trigger.dataset.description || "";
      viewer.classList.add("is-open");
      viewer.setAttribute("aria-hidden", "false");
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", closeViewer);

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) {
      closeViewer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer.classList.contains("is-open")) {
      closeViewer();
    }
  });
}

function updateYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = year;
  });
}
