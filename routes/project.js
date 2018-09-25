const router  = require('express').Router()
const Project = require('../models/Project')
const User    = require('../models/User')

router.post('/create_new', (req, res, next) => {
	const {student} = req.body
	const {number_project} = req.body
	Project.findOne({$and: [{student, number_project}]})
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

router.get('/all', (req, res) => {
  Project.find().then(result => res.json(result)).catch(error => console.log(error))
});

router.get('/user/:id', (req, res) => {
  Project.findById(req.params.id).populate('student')
  .then(result => res.json(result)).catch(error => console.log(error))
});

router.get('/:cohort/project/:number_project', (req, res, next) => {
	const {cohort, number_project} = req.params
	Project.find({$and: [{cohort}, {number_project}]}).populate('student', 'username')
	.then(response => res.json(response))
	.catch(e => console.log(e))
})


/***
 * Rutas chidas de David
 * @type {Router|router}
 ***/

// Proyectos por alumno
router.get('/student/:id', (req, res) => {
  Project.find({student: req.params.id})
      .then(projects => {
        res.json({projects});
      })
      .catch(err => {
        res.status(500).json({msg: "Error al buscar proyectos por usuario", err})
      })
});

module.exports = router