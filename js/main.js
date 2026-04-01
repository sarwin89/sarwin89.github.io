document.addEventListener("DOMContentLoaded", () => {
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const savedTheme = window.localStorage.getItem("sarwinTheme") || preferredTheme;

  applyTheme(savedTheme);
  setupThemeToggle();
  setupDrawer();
  highlightCurrentPage();
  setupSectionNav();
  setupReveal();
  setupCaptureGallery();
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

function setupCaptureGallery() {
  const starsGrid = document.querySelector("[data-capture-grid='stars']");
  if (!starsGrid) {
    return;
  }

  const portraitShots = new Set([8, 9, 10, 14, 15, 20, 21, 23, 24, 27, 32, 35, 38, 41, 42, 43, 44, 45]);
  const totalShots = 46;

  const cards = Array.from({ length: totalShots }, (_, indexOffset) => {
    const index = indexOffset + 1;
    const shotIndex = String(index).padStart(2, "0");
    const extension = index >= 7 && index <= 37 ? "JPG" : "jpg";
    const imagePath = "img/Stars/StarsProcessed-" + index + "." + extension;
    const orientation = portraitShots.has(index) ? "portrait" : "landscape";
    const format =
      orientation === "portrait"
        ? "Portrait frame - Pixel 7 astrophotography"
        : "Landscape frame - Pixel 7 astrophotography";

    return createCaptureCard({
      id: "stars-" + shotIndex,
      image: imagePath,
      alt: "Star photo " + shotIndex + " captured on Pixel 7",
      title: "Star frame " + shotIndex,
      summary: "Night sky capture from your Stars archive.",
      description: "Astrophotography frame " + shotIndex + " from the Pixel 7 Stars folder.",
      series: "Stars collection",
      format: format,
      characterNote:
        "Pixel 7 capture from the same astro run, kept for star density and overall sky texture.",
      studioNote:
        "Processed to keep the night atmosphere natural while lifting detail only where needed.",
      orientation: orientation
    });
  });

  starsGrid.replaceChildren(...cards);
}

function createCaptureCard(item) {
  const article = document.createElement("article");
  article.className = "gallery-card capture-card";
  article.classList.add(item.orientation === "portrait" ? "capture-card--portrait" : "capture-card--landscape");

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("data-lightbox-trigger", "");
  button.dataset.artId = item.id;
  button.dataset.image = item.image;
  button.dataset.alt = item.alt;
  button.dataset.title = item.title;
  button.dataset.description = item.description;
  button.dataset.series = item.series;
  button.dataset.format = item.format;
  button.dataset.characterNote = item.characterNote;
  button.dataset.studioNote = item.studioNote;
  button.dataset.likeDefault = "Like this photo";
  button.dataset.likeLiked = "Liked on this device";

  const frame = document.createElement("div");
  frame.className = "gallery-card__frame";

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.alt;
  image.loading = "lazy";
  image.decoding = "async";
  frame.append(image);

  const content = document.createElement("div");
  content.className = "gallery-card__content capture-card__content";

  const kicker = document.createElement("span");
  kicker.className = "card-kicker";
  kicker.textContent = "Pixel 7 astro";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = item.title;

  const summary = document.createElement("p");
  summary.textContent = item.summary;

  content.append(kicker, title, summary);
  button.append(frame, content);
  article.append(button);

  return article;
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
  const series = viewer.querySelector("[data-viewer-series]");
  const format = viewer.querySelector("[data-viewer-format]");
  const character = viewer.querySelector("[data-viewer-character]");
  const studio = viewer.querySelector("[data-viewer-studio]");
  const media = viewer.querySelector("[data-viewer-media]");
  const likeButton = viewer.querySelector("[data-viewer-like]");
  const likeLabel = viewer.querySelector("[data-viewer-like-label]");
  const likeCount = viewer.querySelector("[data-viewer-like-count]");
  const deviceNote = viewer.querySelector("[data-viewer-device-note]");
  const closeButton = viewer.querySelector("[data-viewer-close]");
  const likesStorageKey = "sarwinArtworkLikesV1";
  const deviceStorageKey = "sarwinArtworkDeviceV1";
  const deviceId = getDeviceId();
  const likesStore = getLikesStore();
  let lastTrigger = null;
  let activeArtId = null;
  let activeLikeDefaultLabel = viewer.dataset.likeDefault || "Like this artwork";
  let activeLikeLikedLabel = viewer.dataset.likeLiked || "Liked on this device";

  function getDeviceId() {
    try {
      const saved = window.localStorage.getItem(deviceStorageKey);
      if (saved) {
        return saved;
      }
      const generated =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : "dev-" + Math.random().toString(36).slice(2, 10);
      window.localStorage.setItem(deviceStorageKey, generated);
      return generated;
    } catch (error) {
      return "volatile-device";
    }
  }

  function getLikesStore() {
    try {
      const saved = window.localStorage.getItem(likesStorageKey);
      if (!saved) {
        return {};
      }
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveLikesStore() {
    try {
      window.localStorage.setItem(likesStorageKey, JSON.stringify(likesStore));
    } catch (error) {
      return;
    }
  }

  function getLikeEntry(artId) {
    if (!artId) {
      return {
        count: 0,
        devices: {}
      };
    }
    const entry = likesStore[artId];
    if (!entry || typeof entry !== "object") {
      return {
        count: 0,
        devices: {}
      };
    }
    return {
      count: Number.isFinite(entry.count) ? Math.max(0, entry.count) : 0,
      devices: entry.devices && typeof entry.devices === "object" ? entry.devices : {}
    };
  }

  function setBackdrop(src) {
    if (!src) {
      viewer.style.removeProperty("--viewer-image");
      if (media) {
        media.style.removeProperty("--viewer-media-image");
      }
      return;
    }
    const safeSrc = String(src).replace(/"/g, '\\"');
    const value = 'url("' + safeSrc + '")';
    viewer.style.setProperty("--viewer-image", value);
    if (media) {
      media.style.setProperty("--viewer-media-image", value);
    }
  }

  function getOrientationFromTrigger(trigger) {
    const formatValue = (trigger.dataset.format || "").toLowerCase();
    if (formatValue.includes("portrait")) {
      return "portrait";
    }
    if (formatValue.includes("landscape")) {
      return "landscape";
    }
    return "auto";
  }

  function syncLikeUi() {
    if (!likeButton || !likeLabel || !likeCount || !activeArtId) {
      return;
    }

    const entry = getLikeEntry(activeArtId);
    const liked = Boolean(entry.devices[deviceId]);
    likeCount.textContent = String(entry.count);
    likeButton.classList.toggle("is-liked", liked);
    likeButton.setAttribute("aria-pressed", String(liked));
    likeLabel.textContent = liked ? activeLikeLikedLabel : activeLikeDefaultLabel;

    if (deviceNote) {
      deviceNote.textContent = liked
        ? "Stored locally for this browser and device."
        : "One like per device, saved locally in this browser.";
    }
  }

  const closeViewer = () => {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    viewer.removeAttribute("data-orientation");
    if (media) {
      media.removeAttribute("data-orientation");
    }
    document.body.classList.remove("viewer-open");
    activeArtId = null;
    setBackdrop("");
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      lastTrigger = trigger;
      activeArtId = trigger.dataset.artId || trigger.dataset.image || null;
      image.src = trigger.dataset.image || "";
      image.alt = trigger.dataset.alt || "";
      title.textContent = trigger.dataset.title || "Archive image";
      description.textContent = trigger.dataset.description || "";
      if (series) {
        series.textContent = trigger.dataset.series || "Archive";
      }
      if (format) {
        format.textContent = trigger.dataset.format || "Artwork";
      }
      const orientation = getOrientationFromTrigger(trigger);
      viewer.setAttribute("data-orientation", orientation);
      if (media) {
        media.setAttribute("data-orientation", orientation);
      }
      activeLikeDefaultLabel = trigger.dataset.likeDefault || viewer.dataset.likeDefault || "Like this artwork";
      activeLikeLikedLabel = trigger.dataset.likeLiked || viewer.dataset.likeLiked || "Liked on this device";
      if (character) {
        character.textContent = trigger.dataset.characterNote || "Context note will be added soon.";
      }
      if (studio) {
        studio.textContent = trigger.dataset.studioNote || "Process note will be added soon.";
      }
      setBackdrop(image.src);
      syncLikeUi();
      viewer.classList.add("is-open");
      viewer.setAttribute("aria-hidden", "false");
      document.body.classList.add("viewer-open");
      if (closeButton) {
        closeButton.focus();
      }
    });
  });

  if (likeButton) {
    likeButton.addEventListener("click", () => {
      if (!activeArtId) {
        return;
      }
      const entry = getLikeEntry(activeArtId);
      const liked = Boolean(entry.devices[deviceId]);

      if (liked) {
        delete entry.devices[deviceId];
        entry.count = Math.max(0, entry.count - 1);
      } else {
        entry.devices[deviceId] = true;
        entry.count += 1;
      }

      likesStore[activeArtId] = entry;
      saveLikesStore();
      syncLikeUi();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeViewer);
  }

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
