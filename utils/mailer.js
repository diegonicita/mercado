const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
	debug: true, // Enable debug logs
	tls: {
		rejectUnauthorized: false,
	},
});

// Add verification test
transporter.verify((error, success) => {
	if (error) {
		console.log("SMTP connection error:", error);
	} else {
		console.log("SMTP server is ready to take our messages");
	}
});

module.exports = transporter;
