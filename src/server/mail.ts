import nodemailer from 'nodemailer';
import { serverEnv } from './env';

const { smtp } = serverEnv;

// Only send real mail once host and credentials are all filled in
const transporter =
  smtp.host && smtp.user && smtp.pass
    ? nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: { user: smtp.user, pass: smtp.pass },
      })
    : null;

interface MailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMail({ to, subject, html, text }: MailInput) {
  if (!transporter) {
    // No SMTP configured (local dev): print the mail so the OTP can still be used
    console.info(`[mail] SMTP not configured. To: ${to} | ${subject}\n${text}`);
    return;
  }
  await transporter.sendMail({ from: smtp.from, to, subject, html, text });
}

export function sendPasswordResetOtp(email: string, otp: string, expiresInMinutes: number) {
  const text = `Mã OTP đặt lại mật khẩu Lion Shopping của bạn là: ${otp}. Mã có hiệu lực trong ${expiresInMinutes} phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#062e24">
      <h2 style="color:#047857;margin:0 0 16px">Lion Shopping</h2>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu. Mã OTP của bạn:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f0fdf7;border:1px solid #c8ecdc;border-radius:12px;padding:16px;text-align:center">${otp}</p>
      <p>Mã có hiệu lực trong <b>${expiresInMinutes} phút</b>. Không chia sẻ mã này cho bất kỳ ai.</p>
      <p style="color:#475569;font-size:13px">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    </div>`;
  return sendMail({ to: email, subject: `${otp} là mã đặt lại mật khẩu Lion Shopping`, html, text });
}
