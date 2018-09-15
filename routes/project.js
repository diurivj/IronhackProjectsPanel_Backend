const router  = require('express').Router()
const Project = require('../models/Project')
const User    = require('../models/User')

router.get('/all', (req, res) => {
  Project.find().then(result => res.json(result)).catch(error => console.log(error))
})

router.get('/user/:id', (req, res) => {
  Project.findById(req.params.id).populate('student')
  .then(result => res.json(result)).catch(error => console.log(error))
})

router.post('/create_new', (req, res, next) => {
	const {student} = req.body
	Project.findOne({student})
	.then(r => {
	if(r == null) {
		Project.create(req.body)
		.then(result => {
			User.findByIdAndUpdate(result.student, {$push: {projects: result._id}}, {new:true})
			.then(user => user)
		return res.json(result)
		})
	} else {
		Project.findByIdAndUpdate(r._id, {$set: req.body}, {new:true})
		.then(r => res.json(r))
		.catch(error => console.log(error))
	}
	})
})

module.exports = router
