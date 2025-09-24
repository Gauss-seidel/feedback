// Cambiá esta URL por la que te dio Google Apps Script
const scriptURL = "PEGAR_AQUI_LA_URL_DEL_APP_SCRIPT";

document.getElementById("feedbackForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    fecha: form.fecha.value,
    curso: form.curso.value,
    profe: form.profe.value,
    opinion: form.opinion.value
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(txt => {
    document.getElementById("msg").innerText = "¡Gracias! Tu opinión fue registrada.";
    form.reset();
  })
  .catch(err => {
    document.getElementById("msg").innerText = "Error al enviar. Intenta nuevamente.";
    console.error(err);
  });
});
