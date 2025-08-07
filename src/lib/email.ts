import { createTransport } from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Load from environment variable
    pass: process.env.GMAIL_PASS, // Load from environment variable
  },
});

interface SendActivationEmailArgs {
  to: string;
  token: string;
  clientId: string; // Although not strictly needed for the link, useful for context
}

export async function sendActivationEmail({ to, token }: SendActivationEmailArgs) {
  const activationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/activate?token=${token}`; // Use environment variable for app URL

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Sender address (your Gmail)
      to: to, // Recipient address
      subject: 'Activate Your Account', // Subject line
      text: `Click the link to activate your account: ${activationLink}`, // Plain text body
      html: `<p>Click the link to activate your account: <a href="${activationLink}">${activationLink}</a></p>`, // HTML body
    });
    console.log(`Activation email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending activation email to ${to}:`, error);
    throw new Error('Failed to send activation email.');
  }
}
