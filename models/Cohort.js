const Schema = require('mongoose').Schema

const cohortSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  date: String,
  name: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = require('mongoose').model('Cohort', cohortSchema)