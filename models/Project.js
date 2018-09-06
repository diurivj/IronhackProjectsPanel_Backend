const Schema = require('mongoose').Schema

const projectSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  number_project: Number,
  title: String,
  presentation_slides: String,
  deployed_site: String,
  github_repo: [String],
  visible: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = require('mongoose').model('Project', projectSchema)