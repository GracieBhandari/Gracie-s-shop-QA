import { postJSON, safeNextUrl } from './common.js';

const form = document.getElementById('login-form');
const formError = document.getElementById('form-error');
const submitButton = form.querySelector('button[type="submit"]');

// Keep ?next=... when switching to the register page
document.getElementById('switch-link').href = `/register.html${window.location.search}`;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.hidden = true;
  submitButton.disabled = true;

  try {
    await postJSON('/api/auth/login', {
      email: form.elements.email.value,
      password: form.elements.password.value,
    });
    window.location.href = safeNextUrl();
  } catch (error) {
    formError.textContent = error.status ? error.message : 'Something went wrong. Please try again.';
    formError.hidden = false;
    submitButton.disabled = false;
  }
});
