// api/agenda.js
import { Resend } from "resend";

// Formatea a YYYYMMDDTHHMMSSZ (UTC)
const fmtUTC = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // Soporta body como string u objeto
    const data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { name, date, time, service, comments, email } = data;

    if (!name || !date || !time || !service || !email) {
      return res.status(400).json({ ok: false, error: "Faltan campos requeridos" });
    }

    // Construcción de fechas (se asume time en 24h "HH:mm")
    const start = new Date(`${date}T${time}:00`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ ok: false, error: "Fecha/hora inválida" });
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h por defecto

    // Texto del evento
    const title = `Cita: ${service} - ${name}`;
    const details = comments || "Cita agendada.";
    const location = "Henry & Asociados, León";

    // Enlace Google Calendar con timestamps en UTC
    const gcal =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(title)}` +
      `&dates=${fmtUTC(start)}/${fmtUTC(end)}` +
      `&details=${encodeURIComponent(details)}` +
      `&location=${encodeURIComponent(location)}` +
      `&sf=true&output=xml`;

    // Archivo ICS compatible
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//henry-asociados//agenda//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@henry-asociados.local`,
      `DTSTAMP:${fmtUTC(new Date())}`,
      `DTSTART:${fmtUTC(start)}`,
      `DTEND:${fmtUTC(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    // Envío de email con Resend (usa remitente verificado en tu cuenta)
    const resend = new Resend(process.env.RESEND_API_KEY);
    const sent = await resend.emails.send({
      from: "Agenda <agenda.henryasociados.com>", // cambia a tu remitente verificado
      to: email,
      subject: `Confirmación de cita: ${service}`,
      html: `
        <p>Hola ${name}, tu cita quedó registrada para ${date} a las ${time}.</p>
        <p>Servicio: <b>${service}</b></p>
        <p>Comentarios: ${comments ? String(comments) : "—"}</p>
        <p><a href="${gcal}" target="_blank" rel="noopener">Agregar a Google Calendar</a></p>
      `,
      attachments: [
        { filename: "cita.ics", content: ics, contentType: "text/calendar" },
      ],
    });

    return res.status(200).json({
      ok: true,
      id: sent?.id || null,
      gcal,
      message: "Cita enviada; revisa tu correo para confirmar y añadir al calendario.",
    });
  } catch (err) {
    console.error("email error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
};
