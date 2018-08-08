const router  = require('express').Router()
const Student = require('../models/Student') 

router.post('/create_new', (req, res, next) => {
  Student.create(req.body).then(result => res.json(result)).catch(error => console.log(error))
})

router.get('/all', (req, res) => {
  Student.find().then(result => res.json(result)).catch(error => console.log(error))
})

router.get('/project/:id', (req, res) => {
  Student.findById(req.params.id).populate('projects')
  .then(result => res.json(result)).catch(error => console.log(error))
})

router.get('/cohort/:id', (req, res) => {
  Student.find({"cohort": req.params.id}).populate('projects')
  .then(result => res.json(result)).catch(error => console.log(error))
})

module.exports = router