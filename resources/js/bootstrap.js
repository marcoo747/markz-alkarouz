import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Safely read CSRF token; if missing, create a fallback meta tag so other code
// that accesses document.querySelector('meta[name="csrf-token"]').content won't throw.
const token = document.querySelector('meta[name="csrf-token"]');
const csrfContent = token ? token.getAttribute('content') : '';

if (!token) {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'csrf-token');
  meta.setAttribute('content', csrfContent);
  document.head.appendChild(meta);
}

axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfContent;
window.csrfToken = csrfContent;
