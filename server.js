require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Paste your NEW Google Apps Script deployment URL here
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7NVz0kgYYs-dpjULHCk-OyhRH0el6coahDlNWj6j6a5NtUupVeYIahOS_t8bGpGwFwA/exec';

app.post('/submit', async (req, res) => {
  try {
    console.log('📥 Received:', req.body.name);
    const response = await axios.post(GOOGLE_SCRIPT_URL, req.body);
    if (response.data.status === 'success') {
      console.log('✅ Sheet + Emails handled by Google.');
      res.status(200).json({ success: true, message: 'Form submitted!' });
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => res.send('✅ Backend is running'));
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// const PORT = process.env.PORT || 10000;

// app.use(cors());
// app.use(express.json());

// // PASTE YOUR NEW DEPLOYMENT URL FROM STEP 1 HERE
// const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7NVz0kgYYs-dpjULHCk-OyhRH0el6coahDlNWj6j6a5NtUupVeYIahOS_t8bGpGwFwA/exec';

// app.post('/submit', async (req, res) => {
//   try {
//     console.log('📥 Forwarding submission to Google Script...');
    
//     // Node.js sends the data to Google. 
//     // Google Script then saves it AND sends the emails.
//     const response = await axios.post(GOOGLE_SCRIPT_URL, req.body);

//     if (response.data.status === 'success') {
//       console.log('✅ All tasks (Sheet + Emails) completed by Google Script.');
//       res.status(200).json({ success: true, message: 'Success!' });
//     } else {
//       throw new Error(response.data.message);
//     }
//   } catch (error) {
//     console.error('❌ Error:', error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.get('/', (req, res) => res.send('✅ Backend is running'));

// app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));