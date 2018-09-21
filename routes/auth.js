const router         = require('express').Router();
const User           = require('../models/User');
const passport       = require('passport');
const jwt            = require('jsonwebtoken');
const expressjwt     = require('express-jwt');
const multer         = require('multer');
//const upload         = multer({ dest: './public/uploads' });
const uploadCloud    = require('../helpers/cloudinary');
const sendMail       = require('../helpers/mailer');
const bcrypt         = require('bcrypt');
const checkUser = expressjwt({secret: 'diuri'})

router.post('/change_password', (req, res, next) => {
  const token = req.body.token;
  if (token) {
    User.findOne({tokenToActive:token})
    .then(user=>{
      return user.setPassword(req.body.password)
    })
    .then(user=>{
      user.save();
      return User.findByIdAndUpdate(user._id, {active:true}, {new:true})
    })
    .then(user=>res.json(user))
    .catch(e=>next(e));
  } else {
    console.log('error')
  }
})

router.get('/loggedUser', checkUser, (req, res) => {
  User.findById(req.user.sub)
  .then(user => res.json(user))
  .catch(error => console.log(error))
});

router.post('/signup', (req, res, next) => {
  let {username, email} = req.body
  let h4$$hP4$$ = bcrypt.hashSync(username, bcrypt.genSaltSync(7))
  User.register(req.body, h4$$hP4$$)
  .then(user => {
    sendMail.welcomeMail(user._id, username, email, h4$$hP4$$)
    return res.status(201).json(user)
  })
  .catch(error => res.status(400).send(error))
})

router.post('/login', passport.authenticate('local'), (req,res,next) => {
  const user = req.user;
  const token = jwt.sign({
    sub: req.user._id,
    username: req.user.email
  }, "diuri");
  res.send({user, access_token: token});
});

router.patch('/edit/profile/:id', uploadCloud.single('photoURL'), (req, res, next) => {
  if (req.file) req.body.photoURL = req.file.url
    else req.body.photoURL = 'https://cdn-images-1.medium.com/max/1200/1*69RcxrWXuk385lSxkIYYLA.png'
  console.log(req.file)
  User.findByIdAndUpdate(req.params.id, {...req.body, photoURL: req.body.photoURL}, {new: true})
  .then(user => res.json(user))
  .catch(error => res.send(error))
});

const jwtCheck = expressjwt({
  secret: "diuri"
});

function jwtdiuri(req, res, next) {
  console.log(req.headers);
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    jwt.verify(token, "diuri", function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });
  } else {
      return res.status(403).send({ 
      success: false, 
      message: 'No token provided.' 
    });
  }
}

module.exports = router;
