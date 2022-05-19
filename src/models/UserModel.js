const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true, minLength: 3 },
  password: { type: String, required: true, minLength: 3 },
});

module.exports = model('User', UserSchema);
