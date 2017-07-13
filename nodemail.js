var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.email,
    pass: process.env.emailPass
  }
});

var mailOptions = {
  from: 'DolarHoy Server <' + process.env.email + '>', // sender address
  to: process.env.email, // list of receivers
  subject: '', // Subject line
  text: '', // plaintext body
  html: '' // html body
};


exports.mailOptions = mailOptions;

exports.sendMail = function () {
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log('Message sent: ' + response.message);
    }
    /* if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages*/
  });
};
