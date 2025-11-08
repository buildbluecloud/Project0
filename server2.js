const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

mongoose.connect('mongodb+srv://mervindanao_db_user:Letmein1234!@cluster0.vpcstmw.mongodb.net/signupDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  contact: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Configure Nodemailer with Outlook SMTP
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'buildblue.cloud@hotmail.com',
    pass: 'Letmein1234!'
  }
});

app.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    // Send email notification
    const mailOptions = {
      from: 'buildblue.cloud@hotmail.com',
      to: user.email,
      subject: 'Welcome to BuildBlue Cloud!',
      text: `Hi ${user.firstName},\n\nThank you for signing up! We're excited to have you onboard.\n\nBest,\nBuildBlue Cloud Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).send('Signup successful');
  } catch (err) {
    res.status(500).send('Error saving user');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
