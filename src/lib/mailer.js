const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "", // ALTERE ESSA LINHA
    pass: "" // ALTERE ESSA LINHA
  }
})