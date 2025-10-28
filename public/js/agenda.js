document.getElementById('agenda').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const payload = {
    name: f.name.value,
    date: f.date.value,
    time: f.time.value,
    service: f.service.value,
    comments: f.comments.value,
    email: prompt('Correo para confirmación:')
  };

  const r = await fetch('/api/agenda', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!r.ok) {
    const txt = await r.text();
    console.error('API error:', txt);
    return (document.getElementById('status').textContent = 'Error al enviar la cita.');
  }

  const out = await r.json();
  document.getElementById('status').textContent = 'Cita enviada. Revisa tu correo.';
  // Si quieres, muestra un botón para Google Calendar con out.gcal
});
