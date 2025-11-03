const DESTINO_FORM_SUBMIT = "https://formsubmit.co/tinocomathew845@gmail.com";

function fmtUTC(d) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

async function enviarConFormSubmit(payload, ccEmail, nextUrl) {
  const fd = new FormData();
  // Campos que quieres que lleguen por correo
  fd.append("Nombre", payload.name);
  fd.append("Fecha", payload.date);
  fd.append("Hora", payload.time);
  fd.append("Servicio", payload.service);
  fd.append("Comentarios", payload.comments || "");

  // Opciones de FormSubmit
  fd.append("_subject", "Nueva cita - Henry & Asociados");
  fd.append("_captcha", "false");
  fd.append("_template", "table");
  if (ccEmail) fd.append("_cc", ccEmail);
  if (nextUrl) fd.append("_next", nextUrl);

  const r = await fetch(DESTINO_FORM_SUBMIT, {
    method: "POST",
    body: fd
  });

  // FormSubmit suele responder con 200/302; si la redirección no ocurre porque usamos fetch,
  // igual gestionamos la navegación manualmente con window.location = nextUrl.
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`FormSubmit HTTP ${r.status}: ${txt}`);
  }
  return true;
}

document.getElementById('agenda').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const status = document.getElementById('status');
  status.textContent = 'Enviando…';

  const payload = {
    name: f.name.value.trim(),
    date: f.date.value,
    time: f.time.value,
    service: f.service.value.trim(),
    comments: f.comments.value.trim()
  };

  // Si agregas un input de email del cliente, úsalo como CC:
  const ccEmail = f.client_email ? f.client_email.value.trim() : "";

  // Validación mínima
  if (!payload.name || !payload.date || !payload.time || !payload.service) {
    status.textContent = 'Completa los campos requeridos.';
    return;
  }

  // Construir enlace Google Calendar y guardarlo
  const start = new Date(`${payload.date}T${payload.time}:00`);
  const end = new Date(start.getTime() + 60*60*1000);
  const title = encodeURIComponent(`Cita: ${payload.service} - ${payload.name}`);
  const details = encodeURIComponent(payload.comments || 'Cita agendada.');
  const location = encodeURIComponent('Henry & Asociados, León');
  const gcal =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${fmtUTC(start)}/${fmtUTC(end)}` +
    `&details=${details}&location=${location}&sf=true&output=xml`;

  sessionStorage.setItem('gcal', gcal);
  sessionStorage.setItem('nombre', payload.name);
  sessionStorage.setItem('servicio', payload.service);
  sessionStorage.setItem('fecha', payload.date);
  sessionStorage.setItem('hora', payload.time);

  const nextUrl = document.getElementById('nextUrl').value;

  try {
    await enviarConFormSubmit(payload, ccEmail, nextUrl);
    status.textContent = 'Cita enviada. Redirigiendo…';
    // Redirige manualmente a la página de gracias
    window.location.href = nextUrl;
  } catch (err) {
    console.error(err);
    status.textContent = 'Error al enviar la cita. Intenta de nuevo.';
  }
});