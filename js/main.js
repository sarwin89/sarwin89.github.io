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

const ARTWORK_PROFILES = {
  Anya: {
    series: "Spy x Family",
    description: "Anya Forger is the telepathic child at the center of Spy x Family, adopted into Loid and Yor's improvised family during Operation Strix."
  },
  Chainsaw: {
    series: "Chainsaw Man",
    description: "Chainsaw Man is the fearsome devil form tied to Denji after his contract with Pochita, turning him into one of the series' defining figures."
  },
  DenjiReeze: {
    series: "Chainsaw Man",
    description: "Denji is Chainsaw Man's rough-edged protagonist, while Reze enters the story as the Bomb Devil hybrid whose connection with him drives the Bomb Girl arc."
  },
  Eren: {
    series: "Attack on Titan",
    description: "Eren Yeager is the freedom-obsessed protagonist of Attack on Titan, and his shifting ideals become one of the story's central conflicts."
  },
  Gaara: {
    series: "Naruto",
    description: "Gaara is the former jinchuriki of the One-Tail from the Hidden Sand, later known as the Kazekage after one of Naruto's strongest redemptive arcs."
  },
  Gojo: {
    series: "Jujutsu Kaisen",
    description: "Satoru Gojo is Jujutsu Kaisen's strongest modern sorcerer, famous for his overwhelming power, blindfolded look, and role as a mentor."
  },
  Gojo2: {
    series: "Jujutsu Kaisen",
    description: "Satoru Gojo is Jujutsu Kaisen's strongest modern sorcerer, famous for his overwhelming power, blindfolded look, and role as a mentor."
  },
  GojoGeto: {
    series: "Jujutsu Kaisen",
    description: "Gojo and Suguru Geto begin as prodigious allies, and their ideological split becomes one of Jujutsu Kaisen's most important relationships."
  },
  HashiTobi: {
    series: "Naruto",
    description: "Hashirama and Tobirama Senju are founding figures of Konoha who later become the First and Second Hokage in Naruto's history."
  },
  KnightPrime: {
    series: "Transformers",
    description: "Optimus Prime is the iconic leader of the Autobots, often framed as a protector, commander, and moral center across Transformers stories."
  },
  Luffy: {
    series: "One Piece",
    description: "Monkey D. Luffy is the rubber-bodied captain of the Straw Hat Pirates, chasing the title of Pirate King in One Piece."
  },
  Maaki: {
    series: "Jujutsu Kaisen",
    description: "Maki Zenin is the weapons specialist of Jujutsu Kaisen who fights in a cursed-energy world despite being born without cursed energy herself."
  },
  Makima: {
    series: "Chainsaw Man",
    description: "Makima is the composed Public Safety officer whose authority, charisma, and manipulation define much of Chainsaw Man's first major arc."
  },
  OzzyRandy: {
    series: "Rock icons",
    description: "Ozzy Osbourne and Randy Rhoads became one of heavy metal's memorable singer-guitarist pairings, known for stage energy and sharp guitar work."
  },
  Pochita: {
    series: "Chainsaw Man",
    description: "Pochita is the Chainsaw Devil who forms a contract with Denji, becomes his heart, and quietly anchors the emotional core of Chainsaw Man."
  },
  Rengoku: {
    series: "Demon Slayer",
    description: "Kyojuro Rengoku is the Flame Hashira in Demon Slayer, remembered for his conviction, warmth, and explosive swordsmanship."
  },
  Reze1: {
    series: "Chainsaw Man",
    description: "Reze is the Bomb Devil hybrid in Chainsaw Man, a character whose charm and danger make her central to the Bomb Girl arc."
  },
  Sukuna: {
    series: "Jujutsu Kaisen",
    description: "Ryomen Sukuna is the ancient King of Curses in Jujutsu Kaisen, a terrifying force whose presence drives the series' largest conflicts."
  },
  Yoriichi: {
    series: "Demon Slayer",
    description: "Yoriichi Tsugikuni is Demon Slayer's legendary swordsman, closely tied to Sun Breathing and to Muzan's deepest fear."
  },
  YoriTanji: {
    series: "Demon Slayer",
    description: "Yoriichi represents the legendary origin of Sun Breathing, while Tanjiro Kamado is the empathetic swordsman at the heart of Demon Slayer."
  },
  Zenitsu: {
    series: "Demon Slayer",
    description: "Zenitsu Agatsuma is the anxious Demon Slayer whose fear hides bursts of remarkable speed and Thunder Breathing mastery."
  }
};

function getArtworkKey(trigger) {
  const source = trigger.dataset.image || trigger.querySelector("img")?.getAttribute("src") || "";
  const fileName = source.split("/").pop() || "";
  return fileName.replace(/\.[^.]+$/, "");
}

function getDeviceLabel() {
  const userAgent = navigator.userAgent || "";
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  const signature = `${platform} ${userAgent}`;

  if (/android/i.test(signature)) {
    return "Android";
  }

  if (/iphone|ipad|ipod/i.test(signature)) {
    return "iPhone or iPad";
  }

  if (/win/i.test(signature)) {
    return "Windows";
  }

  if (/mac/i.test(signature)) {
    return "Mac";
  }

  if (/linux/i.test(signature)) {
    return "Linux";
  }

  return "this browser";
}

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
  const shelf = viewer.querySelector("[data-viewer-shelf]");
  const series = viewer.querySelector("[data-viewer-series]");
  const format = viewer.querySelector("[data-viewer-format]");
  const focus = viewer.querySelector("[data-viewer-focus]");
  const note = viewer.querySelector("[data-viewer-note]");
  const blur = viewer.querySelector("[data-viewer-blur]");
  const closeButton = viewer.querySelector("[data-viewer-close]");
  const likeButton = viewer.querySelector("[data-like-button]");
  const likeCount = viewer.querySelector("[data-like-count]");
  const likeLabel = viewer.querySelector("[data-like-label]");
  const likeHint = viewer.querySelector("[data-like-hint]");
  let lastTrigger = null;
  let currentPostId = "";

  const likeStorageKey = (postId) => `sarwinLike:${postId}`;

  const readLikeEntry = (postId) => {
    if (!postId) {
      return null;
    }

    try {
      return JSON.parse(window.localStorage.getItem(likeStorageKey(postId)) || "null");
    } catch {
      return null;
    }
  };

  const writeLikeEntry = (postId) => {
    if (!postId) {
      return;
    }

    try {
      window.localStorage.setItem(
        likeStorageKey(postId),
        JSON.stringify({
          liked: true,
          device: getDeviceLabel()
        })
      );
    } catch {
      // If storage is unavailable, the like button simply stays session-only.
    }
  };

  const clearLikeEntry = (postId) => {
    if (!postId) {
      return;
    }

    try {
      window.localStorage.removeItem(likeStorageKey(postId));
    } catch {
      // Ignore storage failures and keep the viewer usable.
    }
  };

  const renderLikeState = (postId) => {
    if (!likeButton || !likeCount || !likeLabel || !likeHint) {
      return;
    }

    const entry = readLikeEntry(postId);
    const liked = Boolean(entry?.liked);

    likeButton.disabled = !postId;
    likeButton.setAttribute("aria-pressed", String(liked));
    likeLabel.textContent = liked ? "Liked on this browser" : "Like this post";
    likeCount.textContent = liked ? "1" : "0";
    likeHint.textContent = liked ? `Saved on ${entry.device || "this browser"}.` : "Stored on this browser only.";
  };

  if (likeButton) {
    likeButton.addEventListener("click", () => {
      if (!currentPostId) {
        return;
      }

      const existing = readLikeEntry(currentPostId);

      if (existing?.liked) {
        clearLikeEntry(currentPostId);
      } else {
        writeLikeEntry(currentPostId);
      }

      renderLikeState(currentPostId);
    });
  }

  const closeViewer = () => {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const artworkKey = getArtworkKey(trigger);
      const profile = ARTWORK_PROFILES[artworkKey];

      currentPostId = artworkKey;
      lastTrigger = trigger;
      image.src = trigger.dataset.image || "";
      image.alt = trigger.dataset.alt || "";
      title.textContent = trigger.dataset.title || "Archive image";
      description.textContent = profile?.description || trigger.dataset.description || "";
      if (shelf) {
        shelf.textContent = trigger.dataset.shelf || "Art archive";
      }
      if (series) {
        series.textContent = profile?.series || trigger.dataset.series || trigger.dataset.shelf || "Archive note";
      }
      if (format) {
        format.textContent = trigger.dataset.format || "Archive study";
      }
      if (focus) {
        focus.textContent = trigger.dataset.focus || "Composition and finish";
      }
      if (note) {
        note.textContent = trigger.dataset.note || trigger.dataset.description || "";
      }
      if (blur) {
        blur.style.backgroundImage = trigger.dataset.image ? `url("${trigger.dataset.image}")` : "none";
      }
      viewer.classList.add("is-open");
      viewer.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
      renderLikeState(currentPostId);
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
