import nodemailer from 'nodemailer';

export interface SendMagicCodeParams {
  to: string;
  code: string;
  isFounder?: boolean;
}

export interface EmailServiceResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Creates and configures the Nodemailer transport dynamically based on .env variables
 */
function getEmailTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER?.trim();
  // Sanitize Google App Passwords which might contain spaces
  const pass = process.env.SMTP_PASS?.trim().replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  const isGmail = !host || host.includes('gmail.com');

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port: port || 587,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Builds the HTML template for the 6-digit magic code email
 */
function buildMagicCodeHtmlTemplate(to: string, code: string, isFounder: boolean): string {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="utf-8">
      <title>Código de Segurança Gustavo Tec</title>
    </head>
    <body style="margin: 0; padding: 20px 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background: #0b0f19; color: #f1f5f9; border-radius: 24px; padding: 36px 28px; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <div style="display: inline-block; padding: 8px 16px; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 9999px; margin-bottom: 12px;">
              <span style="color: #38bdf8; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">🤖 Bot Gustavo Tec</span>
            </div>
            <h1 style="color: #38bdf8; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Gustavo Tec</h1>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 6px; font-weight: 500;">Portal de Notícias em Tempo Real & Tecnologia</p>
          </td>
        </tr>
        
        <tr>
          <td>
            <div style="background: #111827; border-radius: 18px; padding: 26px; border: 1px solid #1f2937;">
              <h2 style="color: #ffffff; margin-top: 0; font-size: 18px; font-weight: 700;">
                ${isFounder ? '👑 Olá, Fundador & Administrador Gustavo Peixoto!' : '🚀 Olá, bem-vindo ao Gustavo Tec!'}
              </h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 12px 0;">
                Recebemos uma solicitação para aceder à sua conta no <strong>Portal Gustavo Tec</strong> associada ao e-mail <strong style="color: #38bdf8;">${to}</strong>.
              </p>
              <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 18px;">
                Utilize o seu código mágico de segurança de 6 dígitos gerado pelo <strong>Bot Gustavo Tec</strong>:
              </p>
              
              <div style="text-align: center; margin: 28px 0;">
                <div style="display: inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #06b6d4; background: #082f49; padding: 16px 36px; border-radius: 16px; border: 2px solid #0284c7; box-shadow: 0 4px 24px rgba(6,182,212,0.35);">
                  ${code}
                </div>
              </div>
              
              ${isFounder ? `
              <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: 12px; padding: 14px; margin-top: 20px; font-size: 13px; color: #fde047; line-height: 1.5;">
                🛡️ <strong>Acesso Administrativo:</strong> A validação deste código concederá privilégios totais de gestão editorial, configurações e manutenção.
              </div>
              ` : ''}

              <p style="color: #94a3b8; font-size: 12px; margin-top: 22px; margin-bottom: 0; line-height: 1.5;">
                ⏱️ Este código mágico tem validade de <strong>10 minutos</strong> e pode ser usado apenas uma vez.<br/>
                Se você não solicitou este acesso, desconsidere esta mensagem. Sua conta permanece protegida.
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td align="center" style="font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 22px; margin-top: 24px;">
            Enviado com segurança pelo <strong>Bot Gustavo Tec</strong> • Protocolo SMTP Seguro<br/>
            © ${currentYear} Gustavo Tec • Todos os direitos reservados.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Dispatches an authentication magic code email to the specified recipient
 */
export async function sendAuthMagicCodeEmail(params: SendMagicCodeParams): Promise<EmailServiceResult> {
  const { to, code, isFounder = false } = params;
  const user = process.env.SMTP_USER?.trim();
  const transporter = getEmailTransporter();

  if (transporter && user) {
    try {
      const html = buildMagicCodeHtmlTemplate(to, code, isFounder);

      const info = await transporter.sendMail({
        from: `"Bot Gustavo Tec" <${user}>`,
        to,
        subject: `🔐 [${code}] Seu Código de Acesso Mágico - Gustavo Tec`,
        text: `Olá! O seu código de segurança mágico do Bot Gustavo Tec é: ${code}. Válido por 10 minutos.`,
        html,
      });

      console.log(`[Bot Gustavo Tec 🤖 -> SMTP] Código mágico enviado com sucesso para ${to} (MessageId: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (smtpErr: any) {
      const errorMessage = smtpErr?.message || String(smtpErr);
      console.error(`[Bot Gustavo Tec 🤖 -> SMTP Error] Falha ao entregar e-mail para ${to}:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Fallback / Development logging when SMTP credentials are not yet defined
  console.log(`\n========================================`);
  console.log(`[Bot Gustavo Tec 🤖 (Modo Simulação)] E-mail para: ${to}`);
  console.log(`[Bot Gustavo Tec 🤖] Assunto: 🔐 [${code}] Seu Código de Acesso Mágico - Gustavo Tec`);
  console.log(`[Bot Gustavo Tec 🤖] CÓDIGO MÁGICO: ${code} (Válido por 10 minutos)`);
  console.log(`[Bot Gustavo Tec 🤖] Dica: Configure SMTP_USER e SMTP_PASS nas variáveis para entrega SMTP real.`);
  console.log(`========================================\n`);

  return {
    success: true,
  };
}
