/* =============================================================
   MELECS MAILER – Express + Nodemailer SMTP Server
   File: server/server.js

   Start:  node server.js
   Env:    Copy .env.example → .env and fill in credentials.
   ============================================================= */

'use strict';

const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ──────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from the website (same host in production;
// add your domain here when deployed)
const allowedOrigins = [
  'http://localhost',
  'http://127.0.0.1',
  /^file:\/\//,          // local file:// for dev
  'https://melecstech.com',
  'https://www.melecstech.com',
];
app.use(cors({
  origin: (origin, cb) => {
    // Allow no-origin (same-host / Postman) or whitelisted origins
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      cb(null, true);
    } else {
      cb(null, true); // keep permissive for dev; tighten in production
    }
  },
  methods: ['POST', 'OPTIONS'],
}));

/* ── Serve the website's static files ───────────────────── */
// Comment this out if you host the HTML files separately
app.use(express.static(path.join(__dirname, '..')));

/* ── Nodemailer SMTP transporter ────────────────────────── */
const transporter = nodemailer.createTransport({
  host   : 'smtp.gmail.com',
  port   : 587,
  secure : false,          // STARTTLS
  auth: {
    user : process.env.SMTP_USER,
    pass : process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,  // allow self-signed certs in dev
  },
});

/* ── Helper: basic sanitize (strip HTML tags) ───────────── */
const sanitize = (str = '') =>
  String(str).replace(/<[^>]*>/g, '').trim().slice(0, 2000);

/* ── POST /send-inquiry ─────────────────────────────────── */
app.post('/send-inquiry', async (req, res) => {
  /* Honeypot bot trap */
  if (req.body._melecs_honeypot) {
    return res.status(200).json({ ok: true }); // silently discard
  }

  const name    = sanitize(req.body.name);
  const email   = sanitize(req.body.email);
  const phone   = sanitize(req.body.phone)   || '—';
  const company = sanitize(req.body.company) || '—';
  const service = sanitize(req.body.service) || '—';
  const subject = sanitize(req.body.subject) || 'Website Inquiry';
  const message = sanitize(req.body.message);

  /* Validate required fields */
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email and message are required.' });
  }

  /* Basic email format check */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  /* ── Build email ────────────────────────────────────────── */
  const emailSubject = `[MELECS Inquiry] ${subject} — from ${name}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #1a2a3a; background: #f4f7fb; margin: 0; padding: 0; }
    .wrapper { max-width: 640px; margin: 24px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #102a43 0%, #1769aa 100%); padding: 28px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 1.4rem; letter-spacing: -0.5px; }
    .header p  { color: #9fb3c8; margin: 4px 0 0; font-size: 0.88rem; }
    .body  { padding: 28px 32px; }
    .label { font-size: 0.75rem; font-weight: 700; color: #627d98; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 2px; }
    .value { font-size: 1rem; color: #102a43; margin-bottom: 16px; word-break: break-word; }
    .message-box { background: #f4f7fb; border-left: 4px solid #1769aa; padding: 14px 18px; border-radius: 6px; white-space: pre-wrap; }
    .footer { background: #f4f7fb; padding: 16px 32px; font-size: 0.8rem; color: #627d98; border-top: 1px solid #e0e8f0; }
    .badge { display: inline-block; background: #1769aa; color: #fff; padding: 2px 10px; border-radius: 50px; font-size: 0.78rem; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📩 New Website Inquiry</h1>
      <p>Received from the MELECS Technologies contact form</p>
    </div>
    <div class="body">
      <div class="label">From</div>
      <div class="value">${name}${company !== '—' ? ` &nbsp;·&nbsp; ${company}` : ''}</div>

      <div class="label">Email</div>
      <div class="value"><a href="mailto:${email}" style="color:#1769aa;">${email}</a></div>

      <div class="label">Phone</div>
      <div class="value">${phone}</div>

      <div class="label">Service Interested In</div>
      <div class="value"><span class="badge">${service}</span></div>

      <div class="label">Subject</div>
      <div class="value">${subject}</div>

      <div class="label">Message</div>
      <div class="value message-box">${message}</div>
    </div>
    <div class="footer">
      This email was sent automatically by the MELECS Technologies website contact form.
      Do not reply to this notification — reply directly to <a href="mailto:${email}">${email}</a>.
    </div>
  </div>
</body>
</html>`;

  const textBody = `
NEW MELECS WEBSITE INQUIRY
===========================
From    : ${name}${company !== '—' ? ` / ${company}` : ''}
Email   : ${email}
Phone   : ${phone}
Service : ${service}
Subject : ${subject}

Message:
${message}

---
Sent via MELECS Technologies website contact form.
Reply directly to: ${email}
`;

  try {
    await transporter.sendMail({
      from    : `"MELECS Mailer" <${process.env.SMTP_USER}>`,
      to      : process.env.MAIL_TO || 'careers@melecstech.com',
      replyTo : process.env.MAIL_REPLY_TO || email,
      subject : emailSubject,
      text    : textBody,
      html    : htmlBody,
    });

    /* ── Auto-reply to the sender ──────────────────────────── */
    await transporter.sendMail({
      from    : `"MELECS Technologies" <${process.env.SMTP_USER}>`,
      to      : email,
      subject : `We received your inquiry — MELECS Technologies`,
      html    : `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#1a2a3a;">
          <div style="background:linear-gradient(135deg,#102a43 0%,#1769aa 100%);padding:28px 32px;border-radius:10px 10px 0 0;">
            <h2 style="color:#fff;margin:0;">Thank you, ${name}!</h2>
          </div>
          <div style="background:#fff;padding:28px 32px;border-radius:0 0 10px 10px;border:1px solid #e0e8f0;">
            <p>We have received your inquiry regarding <strong>${service}</strong> and will get back to you within <strong>1–2 business days</strong>.</p>
            <p>If your project is urgent, feel free to call us directly:</p>
            <p><strong>📞 +91 7899128234 &nbsp;|&nbsp; 080-40525594</strong></p>
            <hr style="border:none;border-top:1px solid #e0e8f0;margin:20px 0;">
            <p style="font-size:0.88rem;color:#627d98;">
              MELECS Technologies Pvt Ltd<br>
              #1884, C block, Sahakar Nagar, Bangalore – 560092<br>
              <a href="mailto:careers@melecstech.com" style="color:#1769aa;">careers@melecstech.com</a>
            </p>
          </div>
        </div>`,
      text: `Hi ${name},\n\nThank you for contacting MELECS Technologies! We received your inquiry about "${service}" and will respond within 1–2 business days.\n\nFor urgent queries:\n📞 +91 7899128234 | 080-40525594\n\nRegards,\nMELECS Technologies Pvt Ltd`,
    });

    return res.json({ ok: true, message: 'Your inquiry has been sent successfully!' });

  } catch (err) {
    console.error('[Mailer Error]', err);
    return res.status(500).json({
      ok   : false,
      error: 'Server error — could not send email. Please try calling us directly.',
    });
  }
});

/* ── Health check ───────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'melecs-mailer' }));

/* ── Start ──────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n✅  MELECS Mailer running → http://localhost:${PORT}`);
  console.log(`    SMTP user : ${process.env.SMTP_USER}`);
  console.log(`    Mail to   : ${process.env.MAIL_TO || 'careers@melecstech.com'}`);
  console.log(`    Static    : serving ../ (parent directory)\n`);
});

