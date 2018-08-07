const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const sendInvitation = require('../helpers/singInInvitation').sendInvitation;

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

router.post('/invitation', (req,res,next)=>{
  const token = req.body.token;
  if(token) {
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
    res.redirect('/');
  }
})

router.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user=>{
    sendInvitation(user);
    res.json(user);
  })
  .catch(err=>{
    res.status(400).send(err);
    next(err)
  });
});

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
  const user = req.user;
  const token = jwt.sign({
    sub: req.user._id,
    username: req.user.email
  }, "diuri");
  res.send({user, access_token: token});
});

const jwtCheck = expressjwt({
  secret: "diuri"
});

module.exports = router;