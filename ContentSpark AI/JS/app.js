// Combined App JS - Handles all functionality
console.log("APP JS LOADED");

// Set theme immediately on page load
(function() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
})();

// DOM Helpers
function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

// Page scripts depend on these globals; load order should include data.js + ui.js before this file.
const __csData = window.__csData;
const __csUI = window.__csUI;

function ensureDataLoaded() {
  if (!__csData) return false;
  return true;
}

/* =========================
   LUCIDE ICONS
========================= */

lucide.createIcons();

/* =========================
   TYPING ANIMATION
========================= */

const typingElement = document.getElementById("typing-text");

const texts = [
  "Generate Blog Ideas",
  "Generate YouTube Content",
  "Create Viral Social Posts",
  "Build Better Marketing Campaigns",
  "Create Content Faster With AI"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = texts[textIndex];
  if (typingElement) {
    if (!isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500);
        return;
      }
    } else {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        textIndex++;
        if (textIndex >= texts.length) {
          textIndex = 0;
        }
      }
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
}

if (typingElement) {
  typeEffect();
}

/* =========================
   THEME TOGGLE
========================= */

const themeBtn = document.getElementById('theme-toggle-btn') || document.querySelector('.topbar-actions .icon-btn i[data-lucide="moon"]')?.closest('.icon-btn');

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.setAttribute("data-theme", savedTheme);
  if (savedTheme === 'light' && themeBtn) {
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', 'sun');
    }
  }
}

function setProModal(open) {
  const el = document.getElementById('pro-modal-backdrop');
  el?.classList.toggle('show', !!open);
}

document.getElementById('upgrade-btn')?.addEventListener('click', () => {
  setProModal(true);
});

document.getElementById('pro-modal-close')?.addEventListener('click', () => {
  setProModal(false);
});

document.getElementById('pro-modal-backdrop')?.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'pro-modal-backdrop') setProModal(false);
});

$all('.pro-select')?.forEach((btn) => {
  btn.addEventListener('click', () => {
    const plan = btn.getAttribute('data-plan') || 'monthly';
    localStorage.setItem('pro_plan', plan);
    const msg = plan === 'yearly' ? 'Yearly Pro enabled (demo).' : 'Monthly Pro enabled (demo).';
    showToast('Pro Workspace', msg);
    setProModal(false);
  });
});

themeBtn?.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  const icon = themeBtn.querySelector('i');
  if (icon) {
    icon.setAttribute('data-lucide', newTheme === 'light' ? 'sun' : 'moon');
  }
  lucide.createIcons();
});

/* =========================
   ACTIVE SIDEBAR LINKS
========================= */

const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  });
});

/* =========================
   NOTIFICATION SYSTEM
========================= */

const notificationBtn = document.getElementById('notification-btn');
const notificationPopup = document.getElementById('notification-popup');
const notificationCount = document.getElementById('notification-count');

function generateNotifications() {
  const history = __csData?.getHistory() || [];
  const templates = __csData?.getTemplates() || [];
  const favs = __csData?.getFavorites() || [];

  const notifs = [];

  // Add history notifications
  history.slice(0, 3).forEach(run => {
    notifs.push({
      id: 'hist-' + run.id,
      type: 'generation',
      text: `${run.ideas?.length || 0} ideas generated for "${run.topic}"`,
      time: run.createdAt
    });
  });

  // Add favorite notifications
  if (favs.length > 0) {
    notifs.push({
      id: 'fav-count',
      type: 'favorite',
      text: `${favs.length} items saved to favorites`,
      time: new Date().toISOString()
    });
  }

  // Add system notifications
  notifs.push({
    id: 'welcome',
    type: 'system',
    text: 'Welcome to ContentSpark AI - Start generating ideas!',
    time: new Date().toISOString()
  });

  return notifs;
}

function getNotificationIcon(type) {
  const icons = {
    generation: 'zap',
    favorite: 'heart',
    system: 'info'
  };
  return icons[type] || 'bell';
}

function updateNotificationBadge() {
  const notifications = generateNotifications();
  const count = notifications.length;
  if (notificationCount) {
    notificationCount.textContent = String(count);
    notificationCount.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderNotifications() {
  const notifications = generateNotifications();
  if (!notificationPopup) return;
  notificationPopup.innerHTML = notifications.length === 0
    ? '<div class="notification-item">No notifications yet</div>'
    : notifications.map(n => `
      <div class="notification-item" style="display:flex;align-items:center;gap:.5rem;">
        <i data-lucide="${getNotificationIcon(n.type)}" style="width:16px;height:16px;color:var(--primary);"></i>
        <div>${n.text}</div>
      </div>
    `).join('');
  lucide.createIcons();
}

function toggleNotificationPopup() {
  if (notificationPopup) {
    notificationPopup.classList.toggle('show');
    if (notificationPopup.classList.contains('show')) {
      renderNotifications();
    }
  }
}

notificationBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleNotificationPopup();
});

document.addEventListener('click', (e) => {
  if (notificationPopup && notificationPopup.classList.contains('show')) {
    if (!notificationBtn?.contains(e.target) && !notificationPopup.contains(e.target)) {
      notificationPopup.classList.remove('show');
    }
  }
});

updateNotificationBadge();

/* =========================
   LOGOUT HANDLER
========================= */

document.getElementById('logout-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('authenticated');
    window.location.href = '../landing.html';
  }
});

/* =========================
   SEARCH BAR
========================= */

const searchInput = document.querySelector(".search-box input");
searchInput?.addEventListener("focus", () => {
  searchInput.parentElement.style.borderColor = "#CCFF00";
});

searchInput?.addEventListener("blur", () => {
  searchInput.parentElement.style.borderColor = "";
});

/* =========================
   TOAST SYSTEM
========================= */

function showToast(title, message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#111",
    color: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,.08)",
    zIndex: "9999",
    minWidth: "220px",
    boxShadow: "0 10px 30px rgba(0,0,0,.4)"
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}