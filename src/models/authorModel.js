const mongoose = require("mongoose");
require("mongoose-type-email");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required:  [true, 'plese enter name buddy'],
      
    },
    lname: {
      type: String,
      required: [true, ' last name is imprt'],
      
    },

    title: {
      type: String,
      required: [true, 'title can only be Mr/Mrs/Miss'],
      enum: ["Mr", "Mrs", "Miss"],

    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: [true, 'email should be prsent'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },{ timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
