const Schema = require('mongoose').Schema
const PLM    = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  email: String,
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'admin']
  },
  active: {
    type: Boolean,
    default: false
  },
  tokenToActive: String,
  photoURL: {
    type: String,
    default: 'https://cdn-images-1.medium.com/max/1200/1*69RcxrWXuk385lSxkIYYLA.png'
  },
  //ONLY IF THEY ARE STUDENTS WILL HAVE THIS PROPERTIES//
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  cohort: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

userSchema.plugin(PLM, {usernameField:'email'})
module.exports = require('mongoose').model('User', userSchema)
