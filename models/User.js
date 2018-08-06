const Schema = require('mongoose').Schema
const PLM    = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  email: String,
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  active: {
    type: Boolean,
    default: false
  },
  tokenToActive: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

userSchema.plugin(PLM, {usernameField:'email'})
module.exports = require('mongoose').model('User', userSchema)
