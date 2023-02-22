const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

// set up nodemailer transporter
const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      auth: {
            user: process.env.SMTPEMAIL,
            pass: process.env.SMTPPASSWORD
      }
});
    
// set up email content
const mailOptions = {
      from: process.env.MAILOPTIONFROM,
      to: process.env.MAILOPTIONTO,
      subject: process.env.MAILOPTIONSUBJECT,
      text: ''
};

// run cron job every 15 seconds and send email to successful users whos age is valid
async function runCron(pendingRequests){
      schedule.scheduleJob('*/15 * * * * *', function() {
            
            // compose email message
            let emailBody = 'Pending Requests:\n\n';
            
            pendingRequests.forEach(request => {
                  emailBody += `Username: ${request.username}\n`;
                  emailBody += `Address: ${request.address}\n`;
                  emailBody += `Request: ${request.request}\n\n`;
            });
            
            mailOptions.text = emailBody;
            
            // send email
            transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                  console.log('Email could not be sent:', error);
                  } else {
                  console.log("Email info:", info)
                  }
            });
      });
}

module.exports.runCron = runCron;