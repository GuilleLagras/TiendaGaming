import {transport} from './nodemailer.js';


export function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `/restorePassword/${resetToken}`;
  
  const mailOptions = {
    from: 'E-commerce',
    to: email,
    subject: 'Restablecer contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  };
  
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  });
}