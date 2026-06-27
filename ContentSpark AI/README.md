# ContentSpark AI (GitHub Pages)

This project is a **static** front-end app (HTML/CSS/JS) meant to run on **GitHub Pages**.

## Setup (important)
1. Push the repo to GitHub.
2. Go to **GitHub → Settings → Pages**.
3. Set **Source** to:
   - **Build and deployment → None**
   - **Branch:** `main` (or your branch)
   - **Folder:** `/ (root)`

> If you publish from a subfolder like `/docs`, the relative paths like `../JS/app.js` may break.

## Files included
- `index.html` (dashboard/redirect entry)
- `landing.html`
- `CSS/`
- `JS/`
- `Pages/`

## 404 handling
A `404.html` is included so GitHub Pages doesn’t show a blank page if a path is not found.

## Try it
After enabling Pages, open the provided Pages URL in your browser.

