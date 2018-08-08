const router  = require('express').Router()
const Project = require('../models/Project')

router.post('/create_new', (req, res, next) => {
  Project.create(req.body).then(result => res.json(result)).catch(e => console.log(e))
})

router.get('/all', (req, res) => {
  Project.find().then(result => res.json(result)).catch(error => console.log(error))
})

router.get('/user/:id', (req, res) => {
  Project.findById(req.params.id).populate('student')
  .then(result => res.json(result)).catch(error => console.log(error))
})

module.exports = router