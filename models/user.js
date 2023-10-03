const { Schema, model } = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(uniqueValidator)

module.exports = model("User", userSchema);
