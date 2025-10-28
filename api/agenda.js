// api/agenda.js
import axios from "axios";

// Formatea a YYYYMMDDTHHMMSSZ (UTC)
const fmtUTC = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // Body como string u objeto
    const data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { name, date, time, service, comments, email } = data;

    if (!name || !date || !time || !service || !email) {
      return res.status(400).json({ ok: false, error: "Faltan campos requeridos" });
    }

    // Fechas del evento (time en 24h "HH:mm")
    const start = new Date(`${date}T${time}:00`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ ok: false, error: "Fecha/hora inválida" });
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h

    const title = `Cita: ${service} - ${name}`;
    const details = comments || "Cita agendada.";
    const location = "Henry & Asociados, León";

    // Enlace Google Calendar
    const gcal =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(title)}` +
      `&dates=${fmtUTC(start)}/${fmtUTC(end)}` +
      `&details=${encodeURIComponent(details)}` +
      `&location=${encodeURIComponent(location)}` +
      `&sf=true&output=xml`;

    // Archivo ICS
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

    // Envío con Mailtrap Email API
    // Documentación: usa endpoint send.api.mailtrap.io con Bearer token
    const resp = await axios.post(
      "https://send.api.mailtrap.io/api/send",
      {
        from: { email: "no-reply@sandbox.mailtrap.io", name: "Agenda" },
        to: [{ email }],
        subject: `Confirmación de cita: ${service}`,
        html: `
          <p>Hola ${name}, tu cita quedó registrada para ${date} a las ${time}.</p>
          <p>Servicio: <b>${service}</b></p>
          <p>Comentarios: ${comments ? String(comments) : "—"}</p>
          <p><a href="${gcal}" target="_blank" rel="noopener">Agregar a Google Calendar</a></p>
        `,
        attachments: [
          {
            filename: "cita.ics",
            content: Buffer.from(ics).toString("base64"),
            type: "text/calendar",
            disposition: "attachment",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILTRAP_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
      // console.log(typeof process.env.MAILTRAP_TOKEN)
    );

    // Mailtrap responde 200 con un objeto; puedes inspeccionar resp.data si quieres
    return res.status(200).json({
      ok: true,
      id: resp?.data?.message_ids?.[0] || null,
      gcal,
      message: "Cita enviada vía Mailtrap; revisa tu correo.",
    });
  } catch (err) {
    console.error("mailtrap error:", err?.response?.data || err?.message || err);
    return res.status(500).json({
      ok: false,
      error: err?.response?.data || String(err),
    });
  }
};
