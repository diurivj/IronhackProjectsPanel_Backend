const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config();

const genToken = (id, email) => {
  const token = jwt.sign({
    sub: id,
    username: email
  }, "diuri", {expiresIn:"72 hours"} //si no lo pones no expira
);
  User.findByIdAndUpdate(id, {tokenToActive:token})
  .then(user=>token)
  .catch(e=>console.log(e));  
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.mail, 
    pass: process.env.pass 
  }
})

exports.welcomeMail = (id, username, email, password) => {
  genToken(id, email)
  transporter.sendMail({
    from: 'Ironhack Projects Panel',
    to: email,
    subject: 'Welcome to the Ironhack Projects Panel',
    html:
      `
        <p>Welcome ${username}, now you are part of <a href='https://diurivj.com/login'>Ironhack Projects</a></p>. <br/>
        <p>You can access with this email and the following password: <h4>${password}</h4></p>
      `
  }).then(info => console.log(info)).catch(error => console.log(error))
}

exports.recoverPassword = (token, email) => {
  transporter.sendMail({
    from: 'Ironhack Projects Panel',
    to: email,
    subject: 'Recover your password',
    html: 
    `
      <p>Go to this link for reset your password: <a href='https://diurivj.com/reset_password/${token}'>RESET PASSWORD</a>
    `
  }).then(info => console.log(info)).catch(error => console.log(error))
}
