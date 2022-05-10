const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true, minLength: 3 },
  password: { type: String, required: true, minLength: 3 },
  isAuth: { type: Boolean, default: false },  
});

module.exports = model("User", UserSchema);
