const express = require('express');
const cors = require('cors');
const axios = require('axios'); // ← install this

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Replace this with your actual Web App URL from Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGygnY-ihMBV76FN0iCViiDI9OiXbIkfl7appCE4vHMatyE7LLOI3jXGu8WnZTCyRK/exec';

app.post('/submit', async (req, res) => {
  try {
    const response = await axios.post(GOOGLE_SCRIPT_URL, req.body);
    console.log('✅ Data sent to Google Sheets');
    res.status(200).json({ message: 'Submitted to Google Sheets' });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ message: 'Failed to submit to Google Sheets' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
