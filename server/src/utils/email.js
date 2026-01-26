import nodemailer from "nodemailer";

export async function sendResetPasswordEmail({ to, name, resetUrl }) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.log("[RESET PASSWORD] SMTP não configurado. Link:", resetUrl);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "AdotaPet — Redefinição de senha",
    text:
      `Olá ${name || ""}!\n\n` +
      `Recebemos uma solicitação para redefinir sua senha.\n` +
      `Abra o link abaixo para criar uma nova senha:\n\n` +
      `${resetUrl}\n\n` +
      `Se você não solicitou isso, ignore este e-mail.\n`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.4;">
        <h2>Redefinição de senha</h2>
        <p>Olá ${name || ""}!</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p><a href="${resetUrl}" target="_blank" rel="noreferrer">Clique aqui para criar uma nova senha</a></p>
        <p style="color:#666">Se você não solicitou isso, ignore este e-mail.</p>
      </div>
    `,
  });
}
