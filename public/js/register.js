import { postJSON, safeNextUrl } from './common.js';

const form = document.getElementById('register-form');
const formError = document.getElementById('form-error');
const submitButton = form.querySelector('button[type="submit"]');
const FIELDS = ['name', 'email', 'password', 'confirmPassword'];

// Keep ?next=... when switching to the login page
document.getElementById('switch-link').href = `/login.html${window.location.search}`;

// Shows a message at the top of the form and one under each field that has a problem
function showErrors(message, fieldErrors = {}) {
  formError.textContent = message;
  formError.hidden = !message;

  for (const field of FIELDS) {
    const text = fieldErrors[field] || '';
    document.getElementById(`${field}-error`).textContent = text;
    form.elements[field].setAttribute('aria-invalid', text ? 'true' : 'false');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { name, email, password, confirmPassword } = Object.fromEntries(new FormData(form));

  // Checked here only: the server never needs the second copy of the password
  if (password !== confirmPassword) {
    showErrors('Please fix the highlighted fields.', { confirmPassword: 'Passwords do not match.' });
    return;
  }

  showErrors('');
  submitButton.disabled = true;

  try {
    await postJSON('/api/auth/register', { name, email, password });
    window.location.href = safeNextUrl();
  } catch (error) {
    showErrors(error.status ? error.message : 'Something went wrong. Please try again.', error.fields);
    submitButton.disabled = false;
  }
});
