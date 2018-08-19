const Schema = require('mongoose').Schema

const studentSchema = new Schema({
  cohort: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  name: String,
  lastname: String,
  email: String,
  github: String,
  linkedIn: String,
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = require('mongoose').model('Student', studentSchema)