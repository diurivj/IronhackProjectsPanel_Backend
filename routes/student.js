const router  = require('express').Router()
const Student = require('../models/Student') 
const Cohort  = require('../models/Cohort')

router.put('/create_new', (req, res, next) => {
  Student.create(req.body)
  .then(student => {
    Cohort.findByIdAndUpdate(student.cohort, {$push: {students: student._id}}, {new: true})
    .then(cohort => cohort)
    .catch(error => console.log(error))
    res.json(student)
  })
  .catch(error => console.log(error))
})

router.get('/all', (req, res) => {
  Student.find().populate('cohort').then(result => res.json(result)).catch(error => console.log(error))
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