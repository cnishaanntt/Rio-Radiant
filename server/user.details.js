// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  userId: { type: String, required: true, unique:true, index:true },
  userName:{ type: String, required: true},
  emailId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },  
  countryCode: { type: String, required: true },
  language: { type: String, required: true },
  profilePic40: { type: String, required: true}
});

userSchema.index({ name: 1, type: -1 })

// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;