require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS  // your app password
  }
});

app.post('/submit', async (req, res) => {
  const formData = req.body;
  console.log('📥 Received form data:', formData);

  try {
    // 1. Send to Google Sheets
    await axios.post('https://script.google.com/macros/s/AKfycbxGygnY-ihMBV76FN0iCViiDI9OiXbIkfl7appCE4vHMatyE7LLOI3jXGu8WnZTCyRK/exec', formData);

    // 2. Send confirmation email to user
    await transporter.sendMail({
      from: `"Black PantherKan Acadamey Of Sports And martial Arts" <${process.env.EMAIL_USER}>`,
      to: formData.email,
      subject: 'Thanks for contacting us!',
      text: `Hi ${formData.name},\n\nThank you for reaching out. We have received your message:\n\n"${formData.message}"\n\nWe'll get back to you soon!\n\n- Black Pantherkan`
    });

    // 3. Send alert email to YOU
    await transporter.sendMail({
      from: `"Form Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '📨 New Form Submission',
      text: `
You received a new form submission:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Age: ${formData.age}
Subject: ${formData.subject}
Message: ${formData.message}
      `
    });

    res.status(200).json({ message: 'Form submitted, Google Sheet updated, emails sent!' });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});