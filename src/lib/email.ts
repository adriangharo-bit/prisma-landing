import { Resend } from "resend";
import { formatRaffleDate } from "./date";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(apiKey);
}

function emailLayout(bodyHtml: string, footerDomain: string): string {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#0A0A0A; padding:32px 16px;">
    <div style="max-width:480px; margin:0 auto; background:#141414; border:1px solid #262626; border-radius:12px; padding:32px; color:#F5F5F5;">
      <p style="font-size:20px; font-weight:700; letter-spacing:0.02em; margin:0 0 24px;">PRISMA<span style="color:#FF5A1F;">.</span></p>
      ${bodyHtml}
      <hr style="border:none; border-top:1px solid #262626; margin:32px 0 16px;" />
      <p style="font-size:12px; color:#8a8a8a; margin:0;">${footerDomain}</p>
    </div>
  </div>`;
}

export function confirmationEmailHtml(params: {
  name: string;
  raffleDate: string;
}): string {
  const formattedDate = formatRaffleDate(params.raffleDate);
  const body = `
    <p style="font-size:16px; margin:0 0 16px;">Hola ${params.name},</p>
    <p style="font-size:16px; margin:0 0 16px;">Tu registro está confirmado.</p>
    <p style="font-size:16px; margin:0 0 16px;">
      Estás participando en el sorteo de un par de zapatos PRISMA —
      el zapato técnico de boulder de mayor desempeño que Acopa ha construido.
    </p>
    <p style="font-size:16px; margin:0 0 16px;">
      El ganador se anuncia el ${formattedDate}.<br />
      Te avisamos si eres tú.
    </p>
    <p style="font-size:16px; margin:0 0 16px;">
      Mientras tanto, síguenos en @acopaoutdoors para ver más del PRISMA.
    </p>
    <p style="font-size:16px; margin:0;">— El equipo de Acopa</p>
  `;
  return emailLayout(body, "prisma.acopaoutdoors.com");
}

export function winnerEmailHtml(params: { name: string; code: string }): string {
  const body = `
    <p style="font-size:16px; margin:0 0 16px;">Hola ${params.name},</p>
    <p style="font-size:16px; margin:0 0 16px;">
      ${params.code ? `Tu código ${params.code} fue seleccionado.` : "Fuiste seleccionado."}
    </p>
    <p style="font-size:16px; margin:0 0 16px;">
      Ganaste un par de zapatos PRISMA de Acopa Outdoors.
    </p>
    <p style="font-size:16px; margin:0 0 16px;">
      Para reclamar tu premio, responde este email con:
    </p>
    <ul style="font-size:16px; margin:0 0 16px; padding-left:20px;">
      <li>Tu talla de zapato de escalada</li>
      <li>Tu dirección de envío</li>
    </ul>
    <p style="font-size:16px; margin:0 0 16px;">
      Tienes 7 días para responder antes de que seleccionemos a otro ganador.
    </p>
    <p style="font-size:16px; margin:0 0 16px;">
      Felicidades, y que lo disfrutes en la pared.
    </p>
    <p style="font-size:16px; margin:0;">— El equipo de Acopa</p>
  `;
  return emailLayout(body, "acopaoutdoors.com");
}

export async function sendConfirmationEmail(params: {
  name: string;
  email: string;
}): Promise<void> {
  const resend = getResend();
  const fromEmail = process.env.FROM_EMAIL;
  const raffleDate = process.env.RAFFLE_DATE;
  if (!fromEmail || !raffleDate) {
    throw new Error("FROM_EMAIL or RAFFLE_DATE is not configured");
  }

  await resend.emails.send({
    from: fromEmail,
    to: params.email,
    subject: "Ya estás en el sorteo PRISMA.",
    html: confirmationEmailHtml({ name: params.name, raffleDate }),
  });
}

export async function sendWinnerEmail(params: {
  name: string;
  email: string;
  code: string;
}): Promise<void> {
  const resend = getResend();
  const fromEmail = process.env.FROM_EMAIL;
  if (!fromEmail) throw new Error("FROM_EMAIL is not configured");

  await resend.emails.send({
    from: fromEmail,
    to: params.email,
    subject: "Ganaste el PRISMA.",
    html: winnerEmailHtml({ name: params.name, code: params.code }),
  });
}
