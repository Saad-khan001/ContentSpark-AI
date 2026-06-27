// Dashboard enhancements for SaaS experience
(function() {
  // User credits system
  function getUserCredits() {
    const auth = JSON.parse(localStorage.getItem('authenticated') || '{}');
    if (auth.email) {
      const key = `credits_${auth.email}`;
      return parseInt(localStorage.getItem(key) || '50');
    }
    return 0;
  }

  function setUserCredits(credits) {
    const auth = JSON.parse(localStorage.getItem('authenticated') || '{}');
    if (auth.email) {
      localStorage.setItem(`credits_${auth.email}`, String(credits));
      updateCreditsDisplay();
    }
  }

  // Update credits in UI
  function updateCreditsDisplay() {
    const credits = getUserCredits();
    const creditsEl = document.getElementById('user-credits');
    if (creditsEl) {
      creditsEl.textContent = credits;
    }
  }

  // Check if user is on Pro plan
  function isUserPro() {
    const auth = JSON.parse(localStorage.getItem('authenticated') || '{}');
    if (!auth.email) return false;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[auth.email];
    return user?.isPro || localStorage.getItem('pro_plan') === 'monthly' || localStorage.getItem('pro_plan') === 'yearly';
  }

  // Add credits display to topbar
  function enhanceTopbar() {
    const topbarActions = document.querySelector('.topbar-actions');
    if (topbarActions && !document.getElementById('user-credits')) {
      const creditsDiv = document.createElement('div');
      creditsDiv.style.cssText = 'background:rgba(204,255,0,.1);padding:.4rem .8rem;border-radius:8px;font-size:.85rem;color:var(--primary);font-weight:600;';
      creditsDiv.innerHTML = `<i data-lucide="zap" style="width:16px;height:16px;"></i> <span id="user-credits">50</span> credits`;
      topbarActions.insertBefore(creditsDiv, topbarActions.firstChild);
      lucide.createIcons();
    }
  }

  // Initialize
  window.__dashboard = {
    getUserCredits,
    setUserCredits,
    isPro: isUserPro,
    updateCreditsDisplay
  };
})();

// Auto-initialize on pages that have topbar-actions
document.addEventListener('DOMContentLoaded', () => {
  if (typeof enhanceTopbar === 'function') {
    enhanceTopbar();
  }
});