// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var qrSchema = new Schema({
  urn: { type: String, required: true, unique:true, index:true },
  name:{ type: String, required: true},
  displayName:{ type: String, required: true},
  createTime:{ type: Date, required: true },
  createUserId:{ type: String, required: true },
  createUserName: { type: String, required: true },
  lastModifiedTime:{ type: Date, required: true },
  lastModifiedUserId:{ type: String, required: true },
  lastModifiedUserName: { type: String, required: true },
  versionNumber: { type: Number, required: true },
  itemId: { type: String, required: true },
  projectId: { type: String, required: true }  
});

qrSchema.index({ name: 1, type: -1 })

// we need to create a model using it
var Qr = mongoose.model('Qr', qrSchema);

// make this available to our users in our Node applications
module.exports = Qr;