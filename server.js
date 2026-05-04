require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 10000; // Use 10000 for Render

app.use(cors());
app.use(express.json());

// Optimized Transporter for Cloud Hosting
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.post('/submit', async (req, res) => {
  const formData = req.body;
  console.log('📥 Received form data:', formData);

  try {
    // 1. Send to Google Sheets FIRST (Critical Action)
    await axios.post('https://script.google.com/macros/s/AKfycbxGygnY-ihMBV76FN0iCViiDI9OiXbIkfl7appCE4vHMatyE7LLOI3jXGu8WnZTCyRK/exec', formData);
    console.log('✅ Google Sheets updated');

    // 2. Fire emails in the background
    // We do NOT 'await' these so the user gets an instant response
    sendEmails(formData);

    // 3. Respond to the user immediately
    res.status(200).json({ success: true, message: 'Form submitted successfully!' });

  } catch (error) {
    console.error('❌ Critical Error:', error.message);
    res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
});

// Helper function to handle emails without blocking the main response
async function sendEmails(formData) {
  const userMailOptions = {
    from: `"Black PantherKan Academy" <${process.env.EMAIL_USER}>`,
    to: formData.email,
    subject: 'Thank You for Contacting Black PantherKan!',
    text: `Hi ${formData.name}, thank you for reaching out...`,
    html: `<div style="font-family: Arial;"><h2>Hi ${formData.name}!</h2><p>We received your message: <i>"${formData.message}"</i></p></div>`
  };

  const adminMailOptions = {
    from: `"Form Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: '📨 New Form Submission',
    html: `<h3>New Lead: ${formData.name}</h3><p>Email: ${formData.email}</p><p>Message: ${formData.message}</p>`
  };

  try {
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    console.log('📧 Emails sent successfully');
  } catch (err) {
    console.error('📧 Mailer Background Error:', err.message);
  }
}

app.get('/', (req, res) => res.send('✅ Backend is running'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));