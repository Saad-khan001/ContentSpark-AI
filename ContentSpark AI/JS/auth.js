// Authentication System (Mock/Demo)
(function() {
  const signinTab = document.getElementById('signin-tab');
  const signupTab = document.getElementById('signup-tab');
  const nameField = document.getElementById('name-field');
  const authForm = document.getElementById('auth-form');
  const errorMsg = document.getElementById('error-msg');
  const successMsg = document.getElementById('success-msg');
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
  }

  function showSuccess(message) {
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
  }

  function hideMessages() {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
  }

  // Toggle password visibility
  togglePassword?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.innerHTML = type === 'password' ? '<i data-lucide="eye"></i>' : '<i data-lucide="eye-off"></i>';
    lucide.createIcons();
  });

  // Switch between signin/signup
  signinTab?.addEventListener('click', () => {
    signinTab.classList.add('active');
    signupTab.classList.remove('active');
    nameField.style.display = 'none';
    hideMessages();
  });

  signupTab?.addEventListener('click', () => {
    signupTab.classList.add('active');
    signinTab.classList.remove('active');
    nameField.style.display = 'block';
    hideMessages();
  });

  // Handle form submission
  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    hideMessages();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const isSignIn = !signupTab.classList.contains('active');

    if (!email || !password) {
      showError('Please fill in all required fields');
      return;
    }

    // Mock authentication
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (isSignIn) {
      // Sign In
      if (!users[email] || users[email].password !== password) {
        showError('Invalid email or password');
        return;
      }
      localStorage.setItem('authenticated', JSON.stringify({ email, name: users[email].name }));
      showSuccess('Welcome back! Redirecting...');
      setTimeout(() => { window.location.href = '../index.html'; }, 1500);
    } else {
      // Sign Up
      if (users[email]) {
        showError('User already exists. Please sign in.');
        return;
      }
      users[email] = { name, password, createdAt: new Date().toISOString() };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('authenticated', JSON.stringify({ email, name }));
      showSuccess('Account created successfully! Redirecting...');
      setTimeout(() => { window.location.href = '../index.html'; }, 1500);
    }
  });

  // If already authenticated, redirect
  window.addEventListener('DOMContentLoaded', () => {
    const authenticated = localStorage.getItem('authenticated');
    if (authenticated) {
      window.location.href = '../index.html';
    }
    lucide.createIcons();
  });
})();

// Mock admin check
window.__isAdmin = () => {
  const auth = JSON.parse(localStorage.getItem('authenticated') || '{}');
  return auth.email === 'admin@contentspark.ai';
};