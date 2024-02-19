const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const pool = require('./database'); 

const app = express();
const port = 4000;

// Parse JSON requests
app.use(bodyParser.json());
app.use(cors()); 

// Create a transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'syed92809@gmail.com',
    pass: 'faizan..12',
  },
  tls:{
    rejectUnauthorized : false
  }
});

// Define an endpoint to handle email sending
app.post('/forgotpassword', async (req, res) => {
  // Extract data from the request body
  const { email } = req.body;

  // Check if the email exists in the users table
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      // Email doesn't exist in the users table
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    else{

      //mail options
    var mailOptions = {
      from: ' "Verify Email" <syed92809@gmail.com> ',
      to: email,
      subject: 'Only halal - Verify your email',
      html: `<h4> Your Verification Code : 8129 </h4>`
    }


    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ success: false, message: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ success: true, message: 'Email sent' });
      }
    });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
