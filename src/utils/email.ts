import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();

if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

export const sendConfirmationEmail = async (email: string, name: string, confirmationToken: string) => {
  const appUrl = process.env.CONFIRM_APP_URL || "http://localhost:3000";
  const confirmUrl = `${appUrl}/email-confirmado?token=${confirmationToken}`;
  const senderEmail = process.env.EMAIL_FROM || "no-reply@yourapp.com";
  const senderName = process.env.EMAIL_FROM_NAME || "DriveApp";

  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.sender = { email: senderEmail, name: senderName };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = "Confirmação de email - DriveApp";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #4CAF50; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Olá, ${name}!</h2>
          <p>Obrigado por se registrar no DriveApp. Por favor, confirme seu email clicando no botão abaixo:</p>
          <a href="${confirmUrl}" class="button">Confirmar Email</a>
          <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
          <p>${confirmUrl}</p>
          <p>Este link expira em 24 horas.</p>
          <p>Se você não criou uma conta, ignore este email.</p>
        </div>
      </body>
    </html>
  `;

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendPasswordResetEmail = async (email: string, name: string, resetToken: string) => {
  const appUrl = process.env.CONFIRM_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/redefinir-senha?token=${resetToken}`;
  const senderEmail = process.env.EMAIL_FROM || "no-reply@yourapp.com";
  const senderName = process.env.EMAIL_FROM_NAME || "DriveApp";

  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.sender = { email: senderEmail, name: senderName };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = "Redefinição de senha - DriveApp";
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1565c0;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Olá, ${name}!</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no DriveApp.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${resetUrl}" class="button">Redefinir Senha</a>
          <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
          <p>${resetUrl}</p>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanece a mesma.</p>
        </div>
      </body>
    </html>
  `;

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};
