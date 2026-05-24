// ============================================================
// FEEDBACK CEA — Split Panel Interactions
// Theme, Form, Animations, UX
// ============================================================

// ----- THEME MANAGEMENT -----
const THEME_KEY = 'cea-theme';

function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Init
setTheme(getTheme());

// Desktop toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Mobile toggle
document.getElementById('themeToggleMobile').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Listen for system changes (only if user hasn't manually set)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(THEME_KEY)) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// ----- RATING HAPTIC FEEDBACK -----
document.querySelectorAll('.rating-input').forEach((input) => {
  input.addEventListener('change', () => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      label.style.transition = 'transform 80ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      label.style.transform = 'scale(0.92)';
      requestAnimationFrame(() => {
        label.style.transform = '';
      });
    }
  });
});

// ----- FORM SUBMISSION -----
const submitBtn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');
const scriptURL = "https://script.google.com/macros/s/AKfycbwa1Y_OfH_GVzKGZprsZpL1vIr8w6sZ-bu1RqX88A9KjBki2Q_tvRy3oUNcEhUay8-z/exec";

// Helper to get field value
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Validate
  const fecha = getVal('fecha');
  const curso = getVal('curso');
  const profe = getVal('profe');
  const opinion = getVal('opinion');
  const rating = document.querySelector('.rating-input:checked');

  if (!fecha || !curso || !profe || !opinion || !rating) {
    showMessage('Completá todos los campos antes de enviar.', 'error');
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitBtn.querySelector('.submit-btn-text').textContent = 'Enviando...';
  submitBtn.querySelector('.submit-btn-icon').innerHTML = '<span class="spinner"></span>';

  const data = new URLSearchParams();
  data.append('fecha', fecha);
  data.append('curso', curso);
  data.append('profe', profe);
  data.append('opinion', opinion);

  try {
    const res = await fetch(scriptURL, {
      method: 'POST',
      body: data,
    });
    const txt = await res.text();

    if (txt.startsWith("Error")) {
      showMessage('Error al enviar. Intentalo de nuevo.', 'error');
    } else {
      showMessage('¡Gracias! Tu opinión fue registrada.', 'success');
      // Reset form
      document.getElementById('fecha').value = '';
      document.getElementById('curso').value = '';
      document.getElementById('profe').value = '';
      document.getElementById('opinion').value = '';
      document.querySelectorAll('.rating-input').forEach(r => r.checked = false);
    }
  } catch (err) {
    showMessage('Error de conexión. Verificá tu internet.', 'error');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.submit-btn-text').textContent = 'Enviar feedback';
    submitBtn.querySelector('.submit-btn-icon').innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    `;
  }
});

function showMessage(text, type) {
  msg.textContent = text;
  msg.className = `msg visible ${type}`;

  if (type === 'success') {
    setTimeout(() => {
      msg.classList.remove('visible');
    }, 5000);
  }
}

// ----- ENTER KEY SUPPORT -----
document.querySelectorAll('.field-input').forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
      e.preventDefault();
      submitBtn.click();
    }
  });
});
