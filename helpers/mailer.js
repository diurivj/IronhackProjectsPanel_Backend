const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config();

function genToken(id, email){
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
    subject: 'Bienvenido a Projects Panel',
    html:
      `
        <p>Bienvenido ${username}, ahora eres parte de <a href='https://diurivj.com/login'>Ironhack Projects</a></p>. <br/>
        <p>Puedes acceder con este mismo correo y el siguiente password: <h2>${password}</h2></p>
      `
  }).then(info => console.log(info)).catch(error => console.log(error))
}
