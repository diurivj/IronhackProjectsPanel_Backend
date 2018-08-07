require('dotenv').config();

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.mail, 
    pass: process.env.pass 
  }
});

let mailOptions = {
  from: '"Ironhack Projects" <fixtermailer@gmail.com>', // sender address
  to: 'secambialuego', // list of receivers
  subject: 'Te han invitado a ser parte de Ironhack projects ✔', // Subject line
  text: 'Bienvenido a Ironhack projects', // plain text body
  //html: `<b>Da click aquí para crear tu session: </b> ${token}` // html body
};

function genToken(user){
  const token = jwt.sign({
    sub: user._id,
    username: user.email
  }, "diuri", {expiresIn:"72 hours"} //si no lo pones no expira
);
   
mailOptions.html = `
  <b>Da click aquí para crear tu session: </b>
  <a href="https://localhost:3000/invitation?token=${token}"> Puchame </a>
  `;
  mailOptions.to = user.email;
  User.findByIdAndUpdate(user._id, {tokenToActive:token})
  .then(user=>token)
  .catch(e=>console.log(e));  
}

exports.sendInvitation = (user)=>{
  genToken(user);
  transporter.sendMail(mailOptions, (error, info) => {
  console.log(info)
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}