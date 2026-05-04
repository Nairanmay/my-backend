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
  from: `"Black PantherKan Academy of Sports & Martial Arts" <${process.env.EMAIL_USER}>`,
  to: formData.email,
  subject: 'Thank You for Contacting Black PantherKan!',
  text: `Hi ${formData.name},

Thank you for reaching out to us! We have successfully received your message:

"${formData.message}"

Our team will review your inquiry and get back to you as soon as possible. In the meantime, feel free to explore more about our programs and events on our website.

Stay strong, keep training, and welcome to the Black PantherKan family!

Warm regards,
Team Black PantherKan
www.blackpantherkan.com
Phone: +91-XXXXXXXXXX
`,

  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="https://yourwebsite.com/logo.png" alt="Black PantherKan" style="height: 60px;"/>
      </div>
      <h2 style="color: #1a1a1a; text-align: center;">Thank You for Contacting Us!</h2>
      <p style="font-size: 16px; color: #333;">Hi <strong>${formData.name}</strong>,</p>
      <p style="font-size: 16px; color: #333;">
        We have received your message and appreciate you taking the time to reach out:
      </p>
      <blockquote style="background: #fff; padding: 15px; border-left: 5px solid #007bff; margin: 10px 0; color: #555;">
        "${formData.message}"
      </blockquote>
      <p style="font-size: 16px; color: #333;">
        Our team will get back to you shortly. Meanwhile, feel free to check out our programs, upcoming events, and more on our website.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://blackpantherkan.com" style="background: #007bff; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">Visit Our Website</a>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        Stay strong, keep training, and welcome to the Black PantherKan family!<br><br>
        Team Black PantherKan<br>
        <a href="https://blackpantherkan.com" style="color: #007bff;">www.blackpantherkan.com</a><br>
        Phone: +91-XXXXXXXXXX
      </p>
    </div>
  `
});


    // 3. Send alert email to YOU
   await transporter.sendMail({
  from: `"Form Bot" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: '📨 New Form Submission - Black PantherKan',
  text: `
You have received a new form submission:

-----------------------------------------
Name    : ${formData.name}
Email   : ${formData.email}
Phone   : ${formData.phone}
Age     : ${formData.age}
Subject : ${formData.subject}

Message:
${formData.message}
-----------------------------------------

Please respond to this inquiry as soon as possible.
  `,

  html: `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
      <h2 style="color: #333; text-align: center; margin-bottom: 20px;">📨 New Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; font-weight: bold; width: 120px; background: #f1f1f1;">Name:</td>
          <td style="padding: 10px; background: #fff;">${formData.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; background: #f1f1f1;">Email:</td>
          <td style="padding: 10px; background: #fff;">${formData.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; background: #f1f1f1;">Phone:</td>
          <td style="padding: 10px; background: #fff;">${formData.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; background: #f1f1f1;">Age:</td>
          <td style="padding: 10px; background: #fff;">${formData.age}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; background: #f1f1f1;">Subject:</td>
          <td style="padding: 10px; background: #fff;">${formData.subject}</td>
        </tr>
      </table>
      <h3 style="margin-top: 20px; color: #333;">Message:</h3>
      <div style="background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; color: #555; font-size: 15px;">
        ${formData.message}
      </div>
      <p style="margin-top: 20px; font-size: 14px; color: #666; text-align: center;">
        <strong>Black PantherKan Academy of Sports & Martial Arts</strong><br>
        www.blackpantherkan.com | +91-XXXXXXXXXX
      </p>
    </div>
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