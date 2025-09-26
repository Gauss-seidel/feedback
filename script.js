// URL del Web App de Google Apps Script
const scriptURL = "https://script.google.com/macros/s/AKfycbwa1Y_OfH_GVzKGZprsZpL1vIr8w6sZ-bu1RqX88A9KjBki2Q_tvRy3oUNcEhUay8-z/exec";

document.getElementById("feedbackForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;

  // Recolecta los datos del formulario
  const data = new URLSearchParams();
  data.append('fecha', form.fecha.value);
  data.append('curso', form.curso.value);
  data.append('profe', form.profe.value);
  data.append('opinion', form.opinion.value);

  fetch(scriptURL, {
    method: 'POST',
    body: data
  })
  .then(res => res.text())
  .then(txt => {
    if (txt.startsWith("Error")) {
      document.getElementById("msg").innerText = "Error al enviar: " + txt;
    } else {
      document.getElementById("msg").innerText = "¡Gracias! Tu opinión fue registrada.";
      form.reset();
    }
  })
  .catch(err => {
    document.getElementById("msg").innerText = "Error al enviar. Intenta nuevamente.";
    console.error(err);
  });
});

// ------------------------
// MODO OSCURO
// ------------------------
const toggle = document.getElementById("toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");

  if (document.body.classList.contains("oscuro")) {
    toggle.innerText = "☀️";
  } else {
    toggle.innerText = "🌙";
  }
});
