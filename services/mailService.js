const nodemailer = require("nodemailer")
class MailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure:false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        }) 
    }
    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'activation of accaunt',
            text:'',
            html:`<div><a href="${link}">Activaet your accaunt</a></div>`
        })
    }
}

module.exports = new MailService()