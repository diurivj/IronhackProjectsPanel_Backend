const router = require('express').Router()
const Cohort = require('../models/Cohort')

router.post('/create_new', (req, res, next) => {
  Cohort.create(req.body).then(result => res.json(result)).catch(error => console.log(error))
})

router.get('/all', (req, res) => {
  Cohort.find().then(result => res.json(result)).catch(error => console.log(error))
})

router.get('/:id/students', (req, res) => {
  Cohort.findById(req.params.id).populate('students')
  .then(result => res.json(result)).catch(error => console.log(error))
})

router.patch('/update/:id', (req, res, next) => {
  Cohort.findByIdAndUpdate(req.params.id, {$push: {students: req.body.students}}, {new: true}).then(result => res.json(result)).catch(error => console.log(error))
})

module.exports = router