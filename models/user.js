const mongoose = require('mongoose');
const { reqString } = require('../modules/reqTypes');

const userSchema = new mongoose.Schema({
  username: reqString,
  hashedPassword: reqString,
  firstName: reqString,
  lastName: reqString,
  friendsList: [mongoose.SchemaTypes.ObjectId],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
