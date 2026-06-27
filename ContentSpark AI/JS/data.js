// Simple localStorage-backed data layer for the ContentSpark AI UI

const STORAGE_KEYS = {
  theme: "theme",
  history: "cs_history",
  favorites: "cs_favorites",
  ideas: "cs_ideas",
  templates: "cs_templates"
};

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function getHistory() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.history), []);
}

function setHistory(items) {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(items));
}

function getFavorites() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.favorites), []);
}

function setFavorites(items) {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(items));
}

function getTemplates() {
  const existing = safeParse(localStorage.getItem(STORAGE_KEYS.templates), []);
  if (existing.length) return existing;

  const seed = [
    {
      id: "tpl-1",
      title: "Blog Intro Hook",
      category: "Blog",
      content:
        "Hook with a surprising fact, then outline what the reader will learn in the next 3–5 sections."
    },
    {
      id: "tpl-2",
      title: "YouTube Description Structure",
      category: "YouTube",
      content:
        "Start with a 1-sentence summary, add chapter timestamps, include 3 key takeaways, end with a CTA."
    },
    {
      id: "tpl-3",
      title: "Social Post (Thread) Outline",
      category: "Social",
      content:
        "Write 6–10 short beats: problem → insight → steps → example → recap → question CTA."
    }
  ];

  localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(seed));
  return seed;
}

function toggleFavorite(itemId) {
  const favs = getFavorites();
  const exists = favs.includes(itemId);
  const next = exists ? favs.filter(x => x !== itemId) : [...favs, itemId];
  setFavorites(next);
  return !exists;
}

function addHistory(entry) {
  const history = getHistory();
  const next = [entry, ...history].slice(0, 50);
  setHistory(next);
  return next;
}

function addIdea(idea) {
  const ideas = safeParse(localStorage.getItem(STORAGE_KEYS.ideas), []);
  const next = [idea, ...ideas].slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.ideas, JSON.stringify(next));
  return next;
}

function getIdeas() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.ideas), []);
}

// Expose for app.js (no module system in plain HTML)
window.__csData = {
  STORAGE_KEYS,
  getHistory,
  setHistory,
  getFavorites,
  setFavorites,
  getTemplates,
  toggleFavorite,
  addHistory,
  addIdea,
  getIdeas
};

