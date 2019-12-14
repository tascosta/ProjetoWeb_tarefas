const nodeMailer = require('nodemailer');

module.exports = function () {
    
    this.send = function(destino, assunto, corpo) {
        let transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        let mailOptions = {
            to: destino,
            subject: assunto,
            text: corpo
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }    

    return this;
}