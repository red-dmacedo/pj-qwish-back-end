const mongoose = require('mongoose');
const reqTypes = require('./reqTypes');

const userSchema = new mongoose.Schema({
  username: reqTypes.string,
  hashedPassword: reqTypes.string,
  firstName: reqTypes.string,
  lastName: reqTypes.string,
  friendsList: [mongoose.SchemaTypes.ObjectId],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
