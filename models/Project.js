const Schema = require('mongoose').Schema

const projectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  number_project: Number,
  title: String,
  presentation_slides: String,
  deployed_site: String,
  github_repo: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = require('mongoose').model('Project', projectSchema)