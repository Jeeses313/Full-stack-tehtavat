const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'username must be at least 3 characters long'],
    required: true,
    unique: [true, 'username must be unique']
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema)

module.exports = User