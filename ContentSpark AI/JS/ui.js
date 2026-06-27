// Small DOM helpers + rendering for page UI

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function renderList(container, items, renderItem) {
  if (!container) return;
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<div class="activity-item">No items yet.</div>`;
    return;
  }

  for (const item of items) {
    const el = renderItem(item);
    container.appendChild(el);
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', """)
    .replaceAll("'", "&#039;");
}

window.__csUI = {
  $, $all, renderList, escapeHtml
};

