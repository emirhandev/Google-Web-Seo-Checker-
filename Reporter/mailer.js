require('dotenv').config();

const nodemailer = require('nodemailer');
const path = require('path');

function sendEmail(toEmail) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'SEO Analysis Report',
        text: 'Please find the attached SEO analysis report.',
        attachments: [
            {
                filename: 'report.png',
                path: path.join(__dirname, 'report.png')
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('E-mail sent successfully: ' + info.response);
    });
}

module.exports = sendEmail;
