const nodemailer = require('nodemailer');

const defaultInquiryRecipient = 'syazdashmz@gmail.com';

function getInquiryRecipient() {
  return process.env.INQUIRY_TO_EMAIL || defaultInquiryRecipient;
}

function getTransportConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user,
      pass,
    },
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function yesNo(value) {
  return value ? 'Yes' : 'No';
}

function formatContactMethod(value) {
  const labels = {
    whatsapp: 'WhatsApp',
    phone_call: 'Phone Call',
    email: 'Email',
  };

  return labels[value] || value || 'Not specified';
}

function buildInquiryFields(inquiry) {
  return [
    ['Inquiry ID', inquiry.id],
    ['Customer Name', inquiry.full_name],
    ['Phone Number', inquiry.phone_number],
    ['Email Address', inquiry.email || 'Not provided'],
    ['Preferred Contact', formatContactMethod(inquiry.preferred_contact_method)],
    ['Preferred Model', inquiry.car_model_name || 'Advisor recommendation'],
    ['Budget Range', inquiry.budget_range || 'Not specified'],
    ['Monthly Budget', inquiry.monthly_budget || 'Not specified'],
    ['Buying Timeline', inquiry.buying_timeline || 'Not specified'],
    ['Needs Loan Guidance', yesNo(inquiry.needs_loan)],
    ['Has Trade-In', yesNo(inquiry.has_trade_in)],
    ['Lead Source', inquiry.lead_source || 'website'],
    ['Status', inquiry.status || 'new'],
    ['Submitted At', inquiry.created_at || new Date().toISOString()],
  ];
}

function buildInquiryEmail(inquiry) {
  const fields = buildInquiryFields(inquiry);
  const message = inquiry.message || 'No additional message provided.';
  const subjectModel = inquiry.car_model_name || 'Honda advisor recommendation';

  const rows = fields
    .map(
      ([label, value]) => `
        <tr>
          <th style="width:38%;padding:13px 12px;border-bottom:1px solid #e5e7eb;text-align:left;color:#6b7280;font-size:12px;letter-spacing:.04em;text-transform:uppercase;">${escapeHtml(label)}</th>
          <td style="padding:13px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:700;line-height:1.45;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join('');

  const text = [
    `New Honda Inquiry - ${subjectModel}`,
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Customer Message:',
    message,
  ].join('\n');

  const html = `
    <div style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#111827;">
      <div style="max-width:720px;margin:0 auto;padding:28px;">
        <div style="background:#111827;color:#fff;border-radius:20px 20px 0 0;padding:24px;">
          <p style="margin:0 0 8px;color:#fca5a5;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Honda Advisor Platform</p>
          <h1 style="margin:0;font-size:28px;line-height:1.15;">New customer inquiry received</h1>
          <p style="margin:10px 0 0;color:#d1d5db;line-height:1.6;">A customer submitted an inquiry from the website. Review the details below and follow up through the preferred contact method.</p>
        </div>

        <div style="background:#fff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 20px 20px;padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tbody>${rows}</tbody>
          </table>

          <div style="margin-top:24px;padding:18px;border-radius:16px;background:#f9fafb;border:1px solid #e5e7eb;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">Customer Message</p>
            <p style="margin:0;color:#111827;line-height:1.7;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  return {
    subject: `New Honda Inquiry: ${subjectModel} - ${inquiry.full_name}`,
    text,
    html,
  };
}

async function sendInquiryNotification(inquiry) {
  const transportConfig = getTransportConfig();
  const recipient = getInquiryRecipient();

  if (!transportConfig) {
    return {
      sent: false,
      recipient,
      reason: 'SMTP is not configured',
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);
  const email = buildInquiryEmail(inquiry);

  const info = await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      `"Honda Advisor Platform" <${transportConfig.auth.user}>`,
    to: recipient,
    replyTo: inquiry.email || undefined,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  return {
    sent: true,
    recipient,
    messageId: info.messageId,
  };
}

module.exports = {
  sendInquiryNotification,
};
