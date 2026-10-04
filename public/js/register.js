import { postJSON, safeNextUrl, showFormErrors } from './common.js';

const form = document.getElementById('register-form');
const formError = document.getElementById('form-error');
const submitButton = form.querySelector('button[type="submit"]');

// Keep ?next=... when switching to the login page
document.getElementById('switch-link').href = `/login.html${window.location.search}`;

function showErrors(message, fieldErrors) {
  showFormErrors(form, formError, message, fieldErrors);
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
