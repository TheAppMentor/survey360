var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
  	auth: {
    	user: 'teamsurveyforyou@gmail.com',
    	pass: 'survey360ForYou'
  	}
});

// These are functions exposed to other files
module.exports = {
	sendMail: function (mailOptions) {
  		transporter.sendMail(mailOptions, function(error, info) {
  			if (error) {
    			console.log("Email Failed: " + error);
  			} else {
    			console.log("Email sent: " + info.response);
  			}
		});
  	}
};