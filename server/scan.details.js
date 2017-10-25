// grab the things we need
var mongoose = require('mongoose');
var config = require('./config');
var uri =  config.credentials.mongodb_url;
var options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
mongoose.connect(uri, options);
var Schema = mongoose.Schema;

// create a schema
var scanSchema = new Schema({
  itemId: { type: String, required: true },
  projectId: { type: String, required: true },
  profileImage: { type: String, required: true },
  userName: { type: String, required: true },
  emailId: { type: String, required: true },
  currentVersion: { type: Number, required: true },
  latestVersion:{ type: Number, required: true },
  scannedAt: Date
  
});

scanSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the scannedAt field to current date
  this.scannedAt = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var Scan = mongoose.model('Scan', scanSchema);

// make this available to our users in our Node applications
module.exports = Scan;
