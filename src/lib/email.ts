// src/lib/email.ts
import { createTransport } from 'nodemailer';

// Create a transporter using SMTP
const transporter = createTransport({